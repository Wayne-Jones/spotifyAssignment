const fetch = require('node-fetch');
var FeedParser = require('feedparser');
const {englishStopwords} = require('../library/engStopwords.js');

function fetchData (url) {
    return new Promise(function(resolve, reject){
        var headlines = [];
        fetch(url)
        .then((res)=>{
            if (res.status != 200){
                throw new Error('Bad status code');
            }
            else{
                var feedparser = new FeedParser();
                res.body.pipe(feedparser);

                feedparser.on('error', function (error) {
                    console.error(error);
                });
        
                feedparser.on('readable', function() {
                    let post;
                    while (post = this.read()) {
                        if(post.description != null){
                            post.description  = post.description.replace( /(<([^>]+)>)/ig, '');
                            post.description  = post.description.replace( /\r?\n|\r/g, '');
                            post.description  = post.description.trim();
                        }
                        let obj = {
                            "title": post.title,
                            "description": post.description,
                            "link": post.link,
                            "category": post.categories,
                        };
                        headlines.push(obj);
                    }
                });

                feedparser.on ("end", function (err) {
                    if(err) {
                        reject(err);
                    }
                    resolve(headlines);
                });
            }
        })
        .catch(error => console.error(error));
    })        
};

function getTopicsByRegex (headlines) {    
    var topicHashMap = [];
    let regex = /\b([A-Z][A-Za-z-.0-9]*(?:\s*[A-Z][A-Za-z-0-9]*)*)/g;

    let exclusionSet = new Set(englishStopwords);


    headlines.forEach((value, index)=>{
        let title = value.title;
        let description = value.description;
        
        let properNoun = title.matchAll(regex);
    
        let nounArray = [...properNoun];
        nounArray.forEach((noun)=>{
            nounString = noun[0];
            if(exclusionSet.has(nounString.toLowerCase())){
                return;
            }
            if(topicHashMap[nounString]){
                topicHashMap[nounString]++;
            }
            else{
                topicHashMap[nounString] = 1
            }
        });


        if(description != null){
            properNoun = description.matchAll(regex);
        }
        nounArray = [...properNoun];
        nounArray.forEach((noun)=>{
            nounString = noun[0];
            if(exclusionSet.has(nounString.toLowerCase())){
                return;
            }
            if(topicHashMap[nounString]){
                topicHashMap[nounString]++;
            }
            else{
                topicHashMap[nounString] = 1
            }
        });
    });
    
    return topicHashMap;
}

function getTrendingTopics(topicHashMap){
    let topicsObj = {"topics": []};
    let sortedTopicsArray = getSortedKeys(topicHashMap);
    let topicsNum = 5;
    for(let i = 0; i<topicsNum;i++){
        topicsObj.topics.push(sortedTopicsArray[i]);
    }

    return topicsObj;
}

function getSortedKeys(obj) {
    var keys = keys = Object.keys(obj);
    return keys.sort(function(a,b){return obj[b]-obj[a]});
}

module.exports = {fetchData, getTopicsByRegex, getTrendingTopics};