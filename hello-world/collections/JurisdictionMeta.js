// import { CollectionConfig } from 'payload/types';
// const { CollectionConfig } = require('payload/types');

// {
//   orgId: '',
//   languageData: {
//   "languges": [ 'english', 'french' ]
// }
// }

const JurisdictionMeta = {
  slug: 'jurisdiction_content_meta',
  // versioning with drafts enabled tells Payload to save documents to a separate collection in the database and allow publishing
  versions: {
    drafts: true,
  },
  fields: [
    {
     name: "orgId",
     type: 'text',
     required: true,
    },
    {
      name: 'languageData',
      type: 'json',
      required: true
    },
  ],
}

module.exports = JurisdictionMeta;
