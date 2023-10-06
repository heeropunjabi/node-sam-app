const axios = require('axios');
var _ = require('lodash');
// const url = 'http://checkip.amazonaws.com/';
//import payload from 'payload';
const payload = require('payload');
const c = require('./c');
const Orders = require('./collections/Orders')

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

  // await payload.create({
  //   collection: 'posts',
  //   data: {},
  // });

  await payload.create({
    collection: 'orders',
    data: {
      total: 5,
      key: "abc_test",
      value: {
        default: "test val"
      }
    },
  });

  // Perform any Local API operations here
  const a = await payload.find({
    collection: 'orders',
    // where: {} // optional
  });
  console.log("res: ", a);
};

const doActionGet = async (event) => {
  await payload.init({
    secret: '18846d28aee8a5901bf201dd',
    mongoURL: 'mongodb://mongo:27017',
    local: true, // Enables local mode, doesn't spin up a server or frontend
  });

  // get cms data
  console.log("--- find ----");

  // ['en', 'es', 'de']
  let languageToFilter = 'custom_es'
  let orgIdToFilter = 'ORG#00104';

  // // Perform any Local API operations here
  const ContentCms = await payload.find({
    collection: 'content_cms',
    where: {
      pageName: {
        equals: 'LandingPage',
      }
    },
    locale: languageToFilter,
    // limit: 20,
    pagination: false
  });
  console.log("find ContentCms.docs.length : ", ContentCms.docs.length  );

  for (let index = 0; index < ContentCms.docs.length; index++) {
    const element = ContentCms.docs[index];
    if (element.jurisdictionValue){
      const filteredEntries = element.jurisdictionValue.filter(entry => entry.orgId === orgIdToFilter && entry.language === languageToFilter);
      // const filteredEntries = element.jurisdictionValue.filter(entry => entry.orgId === orgIdToFilter);
      console.log("filteredEntries: ", filteredEntries);
      
      if (filteredEntries.length > 0) {
        element.systemValue = filteredEntries[0].value
      }
      // delete jurisdictionValue
      delete element.jurisdictionValue;
    }
    element.orgId = orgIdToFilter;
    console.log("\n CMS: ", {index}, "key: ", element.key, "value: ", element.systemValue, "\n");
  }
  
};

const doActioninitialSeed = async () => {
  await payload.init({
    secret: '18846d28aee8a5901bf201dd',
    mongoURL: 'mongodb://mongo:27017',
    local: true, // Enables local mode, doesn't spin up a server or frontend
  });

  // seed new data - 10 entry's
  // {
  //   pageName: 'LandingPage',
  //   key: 'text_1',
  //   systemValue: 'hello text 1',
  //   baseEnglishValue: 'hello text 1',
  // }

  // var arr = Array.from(Array(10).keys())
  // console.time('----->>>>seeding------->');
  // // for (let index = 0; index < 10000; index++) {
  // arr.forEach(async (index) => {
  //   await payload.create({
  //     collection: 'content_cms',
  //     data: {
  //       pageName: 'LandingPage',
  //       key: `text_${index}`,
  //       systemValue: `hello text_${index}`,
  //       baseEnglishValue: `hello text_${index}`,
  //     },
  //   });
  // });
  // console.timeEnd('----->>>>seeding------->');

  // create / update seedingActive status
  const statusCms = await payload.find({
    collection: 'content_cms_meta',
    // where: {},
  });
  let statusId;
  if (statusCms.docs.length == 0) {
    // create status
    const { id: cmsDocId } = await payload.create({
      collection: 'content_cms_meta',
      data: {
        seedingActive: 'true',
      },
    });
    statusId = cmsDocId;
  } else {
    // update status
    let element = statusCms.docs[0]
    if (element.seedingActive == "true") {
      // return - seeding already in progress
      return " - Already in PROGRESS";
    }
    let newData = {
      seedingActive: "true"
    }
    await payload.update({
      collection: 'content_cms_meta',
      id: element.id,
      data: newData
    });
    statusId = element.id;
  }

  // ['en', 'es', 'de']
  // let languageToFilter = 'en'

  var arr = Array.from(Array(50000).keys())
  payload.logger.info(`seeding cms start...`);
  console.time('----->>>>seeding------->');

  // for (let index = 0; index < arr.length; index++) {
  arr.forEach(async (index) => {
    // Perform any Local API operations here
    const oldContentCms = await payload.find({
      collection: 'content_cms',
      where: {
        pageName: {
          equals: 'LandingPage',
        },
        key: {
          equals: `text_${index}`,
        }
      },
      // locale: languageToFilter
    });
    if (oldContentCms.docs.length == 0) {
      const { id: cmsDocId } = await payload.create({
        collection: 'content_cms',
        data: {
          pageName: 'LandingPage',
          key: `text_${index}`,
          systemValue: `hello text_${index}`,
        },
      });

      const cmsDataDE = {
        pageName: 'LandingPage',
        key: `text_${index}`,
        systemValue: `hello DE text_${index}`
      };

      await payload.update({
        collection: 'content_cms',
        id: cmsDocId,
        locale: 'de',
        data: cmsDataDE
      });

      if (index % 1000 == 0) {
        // console.log("index: ", index);
        payload.logger.info(`create index: ${index}`);
      }
      if (index == arr.length - 1) {
        console.log("xxxxxxxxxxxxxxx LAST index ", index);
        let newData = {
          seedingActive: "false"
        }
        await payload.update({
          collection: 'content_cms_meta',
          id: statusId,
          data: newData
        });
        payload.logger.info(`content_cms_meta seedingActive false index: ${index}`);
      }
    } else {
      let element = oldContentCms.docs[0]
      let newData;
      try {
        
        newData = element;
        newData.systemValue = `hello new new text_${index}`

        await payload.update({
          collection: 'content_cms',
          id: element.id,
          data: newData
        });

        newData.systemValue = `hello new new DE text_${index}`

        await payload.update({
          collection: 'content_cms',
          id: cmsDocId,
          locale: 'de',
          data: cmsDataDE
        });

      } catch (error) {
        payload.logger.info(`error index: ${index}`);
        console.log(" oldContentCms: ", JSON.stringify(oldContentCms));
      }
      // payload.logger.info(`update............: ${index}`);
    if (index % 1000 == 0) {
      // console.log("index: ", index);
      payload.logger.info(`update index: ${index}`);
    }
    if (index == arr.length - 1) {
      console.log("xxxxxxxxxxxxxxx LAST index ", index);
      let newData = {
        seedingActive: "false"
      }
      await payload.update({
        collection: 'content_cms_meta',
        id: statusId,
        data: newData
      });
      payload.logger.info(`content_cms_meta seedingActive false index: ${index}`);
    }
    }
  });

  // }
  console.log("size: ", arr.length);
  console.timeEnd('----->>>>seeding------->');
  return "OK";
};

const doActionNew = async () => {
  await payload.init({
    secret: '18846d28aee8a5901bf201dd',
    mongoURL: 'mongodb://mongo:27017',
    local: true, // Enables local mode, doesn't spin up a server or frontend
  });

  // add juri specific data
  //  -> add/update 'jurisdiction_content_cms' data and update 'content_cms' data

  console.time('----->>>>insert------->');

  // ['en', 'es', 'de']
  let languageToFilter = 'en'

  // Perform any Local API operations here
  const jurisdictionContentCms = await payload.find({
    collection: 'jurisdiction_content_cms',
    where: {
      orgId: {
        equals: 'ORG#00101',
      },
      pageName: {
        equals: 'LandingPage',
      },
      key: {
        equals: 'text_1',
      },
      language: {
        equals: 'en',
      }
    }
  });
  console.log("jurisdictionContentCms len: ", jurisdictionContentCms.docs.length);

  if (jurisdictionContentCms.docs.length > 0) {
    // entry exists - update
    console.log("jurisdictionContentCms - entry exists - update");
    let element = jurisdictionContentCms.docs[0]
    
    let newData = element;
    newData.value = 'updated hello text_1';

    await payload.update({
      collection: 'jurisdiction_content_cms',
      id: element.id,
      data: newData
    });
    //TODO :// RECHECK now as this was already existed, no need to update 'content_cms'
    console.log("jurisdictionContentCms - now as this was already existed, no need to update 'content_cms'");
  } else {
    // not exist - create
    console.log("jurisdictionContentCms - not exist - create");
    const newJurisdictionContentCms = await payload.create({
      collection: 'jurisdiction_content_cms',
      data: {
        orgId: 'ORG#00101',
        pageName: 'LandingPage',
        key: 'text_1',
        value: 'new newly added hello text_1',
        language: 'en'
      },
    });
    console.log("jurisdictionContentCms - new - create - id", newJurisdictionContentCms.id);
    // find and update 'content_cms'. --> id will be availabe from ui, but for now we are doing query
    // Perform any Local API operations here
    const ContentCms = await payload.find({
      collection: 'content_cms',
      where: {
        pageName: {
          equals: 'LandingPage',
        },
        key: {
          equals: 'text_1',
        }
      }
    });
    console.log("find ContentCms len: ", ContentCms.docs.length);
    if (ContentCms.docs.length > 0) {
      // entry exists - update
      console.log("jurisdictionContentCms - ContentCms - entry exists - update");
      let element = ContentCms.docs[0]
      console.log("jurisdictionContentCms - ContentCms - entry exists - element - ", JSON.stringify(element));
      let newJurisdictionValue = element.jurisdictionValue || undefined;
      if (newJurisdictionValue) {
        newJurisdictionValue.push(newJurisdictionContentCms.id);
      } else {
        newJurisdictionValue = [newJurisdictionContentCms.id]
      }
      console.log("jurisdictionContentCms - ContentCms - entry exists - newJurisdictionValue - ", newJurisdictionValue);

      let newData = element;
      newData.jurisdictionValue = newJurisdictionValue;

      await payload.update({
        collection: 'content_cms',
        id: element.id,
        data: newData
      });
      console.log("jurisdictionContentCms - ContentCms - entry exists - newJurisdictionValue - updated ");
    } else {
      // something not good - wrong attempt.
      console.log("something not good - wrong attempt");
    }
  }
  console.timeEnd('----->>>>insert------->');
};

const doActionCloneFromBaseEng = async () => {
  await payload.init({
    secret: '18846d28aee8a5901bf201dd',
    mongoURL: 'mongodb://mongo:27017',
    local: true, // Enables local mode, doesn't spin up a server or frontend
  });

  // 1. get all data from 'content_cms' 
  // 2. check for 'new language' in language date for 'jurisdiction_content_meta', if yes, return - show error
  // 2. check for any org and lang combination in 'jurisdiction_content_cms' if yes, returm - show error
  // 3. create new entry's to 'jurisdiction_content_cms' with value eqaul to selected 'baseEnglishValue' from 'content_cms'
  // 4. add/update 'new language' to 'jurisdiction_content_meta'

  // ---- updtaed flow 
  // 1. get 'jurisdiction_content_meta' for orgId - to verify language already present - if yes, show error
  // 2. additionally, verify 'jurisdiction_content_cms' content as well for newLanguage -  if yes, show error
  // 3. get all keys data 'content_cms' localized - to iterate (batch)
  // 3.a - create new record for 'jurisdiction_content_cms' for OrgId, newLanguage - base value
  // 3.b - update 'content_cms' for newly added 'jurisdictionValue'
  // 4. add / update 'jurisdiction_content_meta' for new language and orgId

  const orgId = "ORG#00102";
  const newLanguage = "my_english";
  console.log("Jurisdiction orgId: ", orgId, "newLanguage: ", newLanguage);

  // ['en', 'es', 'de']
  let baseLanguageToFilter = 'en'

  // // Perform any Local API operations here
  // const JurisdictionMeta = await payload.find({
  //   collection: 'jurisdiction_content_meta',
  //   where: {
  //     orgId: {
  //       equals: orgId,
  //     }
  //   }, // optional
  //   pagination: false
  // });
  // console.log("JurisdictionMeta len: ", JurisdictionMeta.docs.length);
  // if (JurisdictionMeta.docs.length > 0) {
  //   // entry exists - check for languageData
  //   let element = JurisdictionMeta.docs[0]
  //   console.log("JurisdictionMeta - entry exists - element - ", JSON.stringify(element));
  //   let languageList = element.languageData.languages || [];
  //   if (languageList.includes(newLanguage)) {
  //     // newLanguage already exists for this Jurisdiction meta - return show error
  //     return response = {
  //       statusCode: 400,
  //       body: JSON.stringify({
  //         message: 'newLanguage already exists for this Jurisdiction'
  //       }),
  //     };
  //   }
  // }

  // // Perform any Local API operations here
  // const jurisdictionContentCms = await payload.find({
  //   collection: 'jurisdiction_content_cms',
  //   where: {
  //     orgId: {
  //       equals: orgId,
  //     },
  //     language: {
  //       equals: newLanguage,
  //     }
  //   }, // optional,
  //   pagination: false
  // });
  // console.log("jurisdictionContentCms len: ", jurisdictionContentCms.docs.length);
  // if (jurisdictionContentCms.docs.length > 0) {
  //   // entry exists - check for languageData
  //   // newLanguage already exists for this Jurisdiction cms - return show error
  // console.log("jurisdictionContentCms newLanguage already exists for this Jurisdiction cms - return show error: ");
  //   return response = {
  //     statusCode: 400,
  //     body: JSON.stringify({
  //       message: 'newLanguage already exists for this Jurisdiction'
  //     }),
  //   };
  // }

  // Perform any Local API operations here
  const data = await payload.find({
    collection: 'content_cms',
    // where: {} // optional
    pagination: false,
    locale: baseLanguageToFilter,
  });
  console.log("ContentCms len: ", data.docs.length);
  
  console.time('----->>>>update------->');
  // batch processing
  // const totalItems = 10000;
  const totalItems = data.docs.length;
  const batchSize = 1000;

  // for (let i = 0; i < totalItems; i += batchSize) {
  //   console.log(`Processing batch starting from item ${i + 1}`);

  //   // Process a batch of batchSize items
  //   for (let j = i; j < i + batchSize && j < totalItems; j++) {
  //     // Your processing logic for each item (index j)
  //     let element = data.docs[j]
  //     let newData = element;
  //     newData.value["extraKey"] = "extraValue"

  //     await payload.update({
  //       collection: 'orders',
  //       id: element.id,
  //       data: newData
  //     });
  //     console.log(`Processing item ${j} id: ${element.id}`);
  //   }

  //   console.log(`Finished processing batch up to item ${i + batchSize}`);
  // }

  // const items = Array.from({ length: totalItems }, (_, index) => index + 1);

  // (async () => {
  //   for (let i = 0; i < totalItems; i += batchSize) {
  //     console.log(`ContentCms Processing batch starting from item ${i + 1}`);

  //     const batch = items.slice(i, i + batchSize);
  //     await asyncForEach(batch, async (item) => {
  //       // Your processing logic for each item (index item - 1)
  //       let element = data.docs[item - 1]

  //       const newJurisdictionContentCms = await payload.create({
  //         collection: 'jurisdiction_content_cms',
  //         data: {
  //           orgId: orgId,
  //           pageName: element.pageName,
  //           key: element.key,
  //           value: element.systemValue,
  //           language: newLanguage
  //         },
  //       });
  //       console.log(`ContentCms Processing item ${item}`);

  //       // update
  //       // entry exists - update
  //       let newJurisdictionValue = element.jurisdictionValue || undefined;
  //       if (newJurisdictionValue) {
  //         newJurisdictionValue.push(newJurisdictionContentCms.id);
  //       } else {
  //         newJurisdictionValue = [newJurisdictionContentCms.id]
  //       }
  //       console.log("jurisdictionContentCms - ContentCms - entry exists - newJurisdictionValue - ", newJurisdictionValue);

  //       let newData = element;
  //       newData.jurisdictionValue = newJurisdictionValue;

  //       await payload.update({
  //         collection: 'content_cms',
  //         id: element.id,
  //         data: newData
  //       });
  //       console.log("jurisdictionContentCms - ContentCms - entry exists - newJurisdictionValue - updated ");
  //     });

  //     console.log(`ContentCms Finished processing batch up to item ${i + batchSize}`);
  //   }
  // })();

  // var arr = Array.from(Array(totalItems).keys())
  // arr.forEach(async (index) => {
  //   let element = data.docs[index]

  //   const newJurisdictionContentCms = await payload.create({
  //     collection: 'jurisdiction_content_cms',
  //     data: {
  //       orgId: orgId,
  //       pageName: element.pageName,
  //       key: element.key,
  //       value: element.systemValue,
  //       language: newLanguage
  //     },
  //   });
  //   console.log(`ContentCms Processing index ${index}`);

  //   // update
  //   // entry exists - update
  //   let newJurisdictionValue = element.jurisdictionValue || undefined;
  //   if (newJurisdictionValue) {
  //     newJurisdictionValue.push(newJurisdictionContentCms.id);
  //   } else {
  //     newJurisdictionValue = [newJurisdictionContentCms.id]
  //   }
  //   console.log("jurisdictionContentCms - ContentCms - entry exists - newJurisdictionValue - ", newJurisdictionValue);

  //   let newData = element;
  //   newData.jurisdictionValue = newJurisdictionValue;

  //   await payload.update({
  //     collection: 'content_cms',
  //     id: element.id,
  //     data: newData
  //   });

  //   if (index % 1000 == 0) {
  //     // console.log("index: ", index);
  //     payload.logger.info(`jurisdictionContentCms - ContentCms index: ${index}`);
  //   }

  //   console.log("jurisdictionContentCms - ContentCms - entry exists - newJurisdictionValue - updated ", index);
  // });

  const totalBatches = Math.ceil(totalItems / batchSize);
  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = (i + 1) * batchSize;
    const batch = data.docs.slice(start, end);

    console.log(`start: ${start}, end: ${end}, totalBatches: ${totalBatches}`);
    // Fire off the asynchronous operation but don't wait for its completion
    batch.forEach(async (element) => {
      // let element = data.docs[index]

      // const newJurisdictionContentCms = await payload.create({
      //   collection: 'jurisdiction_content_cms',
      //   data: {
      //     orgId: orgId,
      //     pageName: element.pageName,
      //     key: element.key,
      //     value: element.systemValue,
      //     language: newLanguage
      //   },
      // });
      console.log(`ContentCms Processing key ${element.key}`);

      // // update
      // // entry exists - update
      // let newJurisdictionValue = element.jurisdictionValue || undefined;
      // if (newJurisdictionValue) {
      //   newJurisdictionValue.push(newJurisdictionContentCms.id);
      // } else {
      //   newJurisdictionValue = [newJurisdictionContentCms.id]
      // }
      // console.log("jurisdictionContentCms - ContentCms - entry exists - newJurisdictionValue - ", newJurisdictionValue);

      // let newData = element;
      // newData.jurisdictionValue = newJurisdictionValue;

      // await payload.update({
      //   collection: 'content_cms',
      //   id: element.id,
      //   data: newData
      // });

      // if (index % 1000 == 0) {
      //   // console.log("index: ", index);
      //   payload.logger.info(`jurisdictionContentCms - ContentCms index: ${index}`);
      // }

      // console.log("jurisdictionContentCms - ContentCms - entry exists - newJurisdictionValue - updated ", index);
    });
    
  }
  console.log('Asynchronous operations initiated.');

  // // add update newLanguage to jurisdiconte_meta
  // if (JurisdictionMeta.docs.length > 0) {
  //   // entry exists - update
  //   let element = JurisdictionMeta.docs[0]
  //   console.log("JurisdictionMeta entry exists - update : ", element);
  //   let newLanguageData = element.languageData.languages || [];
  //   if (newLanguageData.length > 0) {
  //     newLanguageData.push(newLanguage);
  //   } else {
  //     newLanguageData = [newLanguage]
  //   }

  //   let newData = element;
  //   newData.languageData = {
  //     languages : newLanguageData
  //   };

  //   // update
  //   await payload.update({
  //     collection: 'jurisdiction_content_meta',
  //     id: element.id,
  //     data: newData
  //   });
  //   console.log("JurisdictionMeta entry exists - update done ");
  // } else {
  //   // add newLanguage
  //   console.log("JurisdictionMeta add newLanguage ");
  //   await payload.create({
  //     collection: 'jurisdiction_content_meta',
  //     data: {
  //       orgId: orgId,
  //       languageData: {
  //         languages : [newLanguage]
  //       }
  //     }
  //   });
  //   console.log("JurisdictionMeta add newLanguage - done");
  // }

  console.timeEnd('----->>>>update------->');

  return response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'newLanguage cloned JurisdictionContent and added to JurisdictionMeta'
    }),
  };
};


async function processBatch(batch) {
  // Your processing logic for each item in the batch
  for (const item of batch) {
    // Await any asynchronous operations for each item
    await someAsyncOperation(item);
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

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


exports.lambdaHandlerHello = async (event, context) => {

  try {
    await doActionNew();
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hello new entry added - for juri',
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

exports.lambdaHandlerClone = async (event, context) => {

  try {
    return doActionCloneFromBaseEng();
    // await doActionClone();
    // response = {
    //   statusCode: 200,
    //   body: JSON.stringify({
    //     message: 'hello from clone'
    //   }),
    // };
  } catch (err) {
    console.log(`Error: ${err}`);
    console.log(err);
    return err;
  }

  // return response;
};

exports.doActioninitialSeed = async (event, context) => {
  
  try {
    let status = await doActioninitialSeed();

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `hello world - seed data ${status}`,
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

exports.lambdaHandlerGet = async (event, context) => {

  try {
    return doActionGet(event);
  } catch (err) {
    console.log(`Error: ${err}`);
    console.log(err);
    return err;
  }

  // return response;
};
