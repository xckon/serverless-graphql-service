require('dotenv').config();
const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  getMoviesPaged: (pageSize = 20, lastEvaluatedKey = undefined) => {
    return new Promise(async (resolve) => {
      let movies = [];
      const params = {
        TableName : "Movies",
        Limit: pageSize,
      };

      if(lastEvaluatedKey !== undefined) {
        params.ExclusiveStartKey = JSON.parse(Buffer.from(lastEvaluatedKey, 'base64'));
      }
      
      const items = await docClient.scan(params).promise();
      items.Items.forEach((item) => movies.push(item));

      const movieConnection = {
        movies,
        hasMore: true,
        cursor: Buffer.from(JSON.stringify(items.LastEvaluatedKey)).toString("base64"),
      };

      console.log(movieConnection);
        
      resolve(
        movieConnection
      );
    });
  },

  createMovie: (year, title, info) => {
    return new Promise(async (resolve, reject) => {
      const movie = {
        "year":  year,
        "title": title,
        "info":  info
      };

      const params = {
        TableName: "Movies",
        Item: movie
      };
    
      docClient.put(params, function(err, data) {
        let success = true;
        let message;
        if (err) {
          success = false;
          message = 'Unable to add movie' + movie.title + '. Error JSON: ' + JSON.stringify(err, null, 2);
        } else {
          message = 'PutItem succeeded: ' + movie.title;
        }

        resolve({
          success,
          message,
          movie,
        });
      });
    });
  },
};