const axios = require('axios');
var _ = require('lodash');
// const url = 'http://checkip.amazonaws.com/';
//import payload from 'payload';
const payload = require('payload');
const c = require('./c');

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
const doAction = async () => {
  await payload.init({
    secret: '18846d28aee8a5901bf201dd',
    mongoURL: 'mongodb://mongo:27017',
    local: true, // Enables local mode, doesn't spin up a server or frontend
  });

  // Perform any Local API operations here
  await payload.find({
    collection: 'orders',
    // where: {} // optional
  });

  // await payload.create({
  //   collection: 'posts',
  //   data: {},
  // });
};
exports.lambdaHandler = async (event, context) => {
  console.log('init payload-->', _.compact([0, 1, false, 2, '', 3]));

  console.log(`c.x: ${c.x}`);
  console.log(`c.y: ${c.y()}`);

  try {
    await doAction();
    // const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';
    // response = await axios({
    //   method: 'get',
    //   url: 'https://jsonplaceholder.typicode.com/todos',
    //   //   params: {
    //   //     _limit: 5,
    //   //   },
    // });
    // console.log('Response data:', response.status);

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hello world',
        // location: ret.data.trim()
      }),
    };
  } catch (err) {
    console.log(`Error: ${err}`);
    console.log(err);
    return err;
  }

  return response;
};
