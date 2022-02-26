function getAuthors(){
    return Array.from(document.querySelectorAll('.author')).map(x => x.innerText);
}

async function getAbout(username){
    return await (await fetch(`https://www.reddit.com/user/${username}/about.json`)
        .then(r => r.json()));
}

async function getComments(username){
    return await (await fetch(`https://www.reddit.com/user/${username}/comments.json`)
        .then(r => r.json()));
}

function wordsRatio(comments){

    /**
     * This function iterates through the user comments (generally the last 25) and
     * creates a json object (keywords) with the most used words, then returns the
     * sum(number_of_times_keyword_appeared/number_of_comments)/number_of_keywords
     * 
     * I've considered adding a list of words to be excluded, like the most used words, such as "the",
     * but decided against it since it would be biased, especially towards foreign languages.
     */
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
    
    return ratio/Object.keys(keywords).length;
}

function appendTag(authors,response){
    if (response !=0){
        let element = authors.filter(({innerText}) => innerText === response)
        const tag = document.createElement('a');
        tag.id = 'my_tag';
        tag.style['color'] = 'red'
        tag.innerHTML = `[BOT]`;
        element.appendChild(tag);
    }
}


async function isBot(about,comments){

        //number of years (integer) since creation
        let account_age = Math.trunc((Date.now() - (about.created*1000))/31563000000);
        let comment_karma = about.comment_karma;
        let avg_resp_time; //TODO
        let distinct_subreddits; //TODO

        let words_ratio = wordsRatio(comments,about.name);
        
        //if (wordsRatio > 1)
            return about.name;
        //else
          //  return 0;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete'){

        chrome.scripting.executeScript({
            target: { tabId: tabId},
            func: getAuthors,
        },
        (authors) =>{
            authors[0].result.forEach(element => {
                getAbout(element).then(about =>{
                    getComments(element).then(comments =>{
                        isBot(about.data,comments.data.children).then(response =>{   
           
                        });
                    });
                });
            });
        })
    }
});