# Spotify Assignment

Exercise instructions and scope of the assignment can be found in Spotify_Server_Engineer_Challenge.pdf

### Install Dependencies

```
yarn install
```

### Running Server

To run the express server, execute the script

```
yarn start
```

To get trending topics you can use Postman to do a GET request to `http://localhost:8888/trending`

### How is this done?

Currently the server uses a RegEx to comb through all the topics that we get from our RSS feeds. The Regular Expression itself is not 100% accurate and may include unwanted characters for our headlines string. Although it tries it's best to grab Proper Nouns which typically is formed using words with consecutive capital letters. But this could be problematic if the entire headline has every word capitalized - it can form a bunch of false-positives.

In an effort to remedy that, I used a dictionary of common english stopwords and filtered our headlines array. From there we did a running total of matching topic strings and returned the top 5 trending topics.

### What would I improve upon?

So if this application is going the RegEx route, cleaning up more of the RegEx would have to be in order to try to get things even more accurate. Using Regular Expression will probably never get things 100% accurate but it will get us close.

If I had more time, I would have used our headline strings and used a Natural Language Processor to filter out stopwords and accurately highlight Proper Nouns. Natural Language Processors might also combine related topics, for example "SCOTUS" and "Supreme Court" would be commonly related and should count as 2 under one topic umbrella.
