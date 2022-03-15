# Reddit Bot Detector

This project is a WIP of a Chrome V3 extension, aiming to detect bots specifically on [Reddit](https://reddit.com/).

## Introduction

Reddit is a growing social media platform, and thus it's also seeing an uptick in bots trying to influence opinions on diverse subreddits.

This Chrome extension flags an user as a possible bot, enhancing your Reddit browsing experience.

## Detection

Currently this implementation checks the user comments and calculates a `words_ratio` based on the number of times words are repeated. This isn't ideal, as the extension might flag a user who use a lot of pronouns and connectors as a potential bot.

There are better ways to do this, probably using a Natural Language Processing module, like Spacy in Python, to check for actual nouns, but unfortunately Javascript doesn't offer a lot of options in this regard.

I'd like to point out that even with this problem, this extension is still quite accurate, and will ignore most ordinary users, while detecting most bots.

## Installation

To install this extension it's necessary to access `chrome://extensions` and set chrome to `Developer Mode`, then load the downloaded extension into your browser.

For more information check Chrome documentation on [extensions](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked).

## Usage

The extension will automatically run in background everytime you access a Reddit thread or post, and add a tag to every user it detects as a bot.
