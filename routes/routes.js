const express = require('express');
const {fetchData, getTopicsByRegex, getTrendingTopics} = require('../controllers/feed.js');

// const { addCandidateToDB, getCandidateWithMostSkills } = require('../controllers/candidateHandler.js');

const router = express.Router();

router.get('/trending', async (req, res, next) => {
    const CNN_URL = "http://rss.cnn.com/rss/cnn_topstories";
    const NYT_URL = "http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml";
    const FOX_URL = "http://feeds.foxnews.com/foxnews/latest";

    let headlines = [];

    const foxHeadlines = await fetchData(FOX_URL);
    headlines.push(...foxHeadlines);

    const nytHeadlines = await fetchData(NYT_URL);
    headlines.push(...nytHeadlines);
    
    const cnnHeadlines = await fetchData(CNN_URL);
    headlines.push(...cnnHeadlines);

    const topicArray = getTopicsByRegex(headlines);

    let body = getTrendingTopics(topicArray);

    res.json(body);
;
    // console.log(headlines.length);
    
});
module.exports = router;