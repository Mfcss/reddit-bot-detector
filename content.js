const CLASS = 'is-bot';
const LS_KEY = 'b:';
const USER_URL = location.origin + '/user/';
const SEL = `a[href^="/user/"], a[href^="${USER_URL}"]`;
const checkedElems = new WeakSet();
const promises = {};

new MutationObserver(onMutation)
  .observe(document, {subtree: true, childList: true});

function onMutation(mutations) {
  for (const {addedNodes} of mutations) {
    for (const n of addedNodes) {
      const toCheck = n.tagName === 'a'
        ? n.href.startsWith(USER_URL) && [n]
        : n.firstElementChild && n.querySelectorAll(SEL);
      for (const el of toCheck || []) {
        if (checkedElems.has(el)) continue;
        checkedElems.add(el);
        const name = el.href.slice(USER_URL.length);
        const isBot = localStorage[LS_KEY + name];
        if (isBot === '1') {
          el.classList.add(CLASS);
        } else if (isBot !== '0') {
          (promises[name] || (promises[name] = checkUser(name)))
            .then(res => res && el.classList.add(CLASS));
        }
      }
    }
  }
}

async function isBot(username){

    /**
     * This function iterates through the user comments (generally the last 25) and
     * creates a json object (keywords) with the most used words, then returns the
     * sum(number_of_times_keyword_appeared/number_of_comments)/number_of_keywords
     * 
     * I've considered adding a list of words to be excluded, like the most used words, such as "the",
     * but decided against it since it would be biased, especially towards foreign languages.
     */

    let comments = await (await fetch(`https://www.reddit.com/user/${username}/comments.json`)).json();
    comments = comments.data.children;
    let words_ratio;
    let keywords = {};
    let ratio=0;

    for (let i = 0; i < comments.length; i++) {
        for (let j = i+1; j < comments.length-1; j++) {
            //Transforms into arrays of words
            let str = comments[i].data.body.match(/\S+/g);
            let str2 = comments[j].data.body.match(/\S+/g);

            //Includes into the (keywords) json object
            str.forEach(element => {
                if(str2.includes(element)){
                    if(keywords.hasOwnProperty(element))
                        keywords[element] +=1;
                    else
                        keywords[element] = 1;
                }
            });
        }
    }
    
    for (var key in keywords) {
        if (keywords.hasOwnProperty(key)) 
            ratio = ratio + keywords[key]/comments.length;
    }
    
    words_ratio = ratio/Object.keys(keywords).length;
    
    if (words_ratio > 1){
        console.log(username);
        return true;
    }else{
       return false;
    }
}

async function checkUser(el, name) {
  const bot = await isBot(name);
  localStorage[LS_KEY + name] = bot ? '1' : '0';
  delete promises[name];
  return bot;
}