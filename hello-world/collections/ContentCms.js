// import { CollectionConfig } from 'payload/types';
// const { CollectionConfig } = require('payload/types');


// {
//   pageName: 'LandingPage',
//   key: 'text_1',
//   systemValue: 'hello text 1',
//   baseEnglishValue: 'hello text 1',
// }

const ContentCms = {
  slug: 'content_cms',
  // versioning with drafts enabled tells Payload to save documents to a separate collection in the database and allow publishing
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'pageName',
      type: 'text',
      required: true,
      index: true
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      index: true
    },
    {
      name: 'systemValue',
      type: 'text',
      required: true,
      // localized fields are stored as keyed objects to represent 
      // each locale listed in the payload.config.ts. For example: { en: 'English', es: 'Espanol', ...etc }
      localized: true,
    },
    // {
    //   name: 'baseEnglishValue',
    //   type: 'text',
    // },
    // {
    //   name: 'baseGermanValue',
    //   type: 'text',
    // },
    {
      name: 'jurisdictionValue',
      type: 'relationship',
      relationTo: 'jurisdiction_content_cms',
      // allow selection of one or more jurisdiction
      hasMany: true,
    }
    // this will be a id from 'jurisdiction_content_cms' collection
    // eg -> 
    // "jurisdictionValue" : [ 
    //   "6517bd6510cba1fe59df905f"
    // ]
  ],
  indexes: [
    {'fields':
      {
        pageName: 1,
        key: 1
      }
    }
  ]
}

module.exports = ContentCms;
