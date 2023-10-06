// import { CollectionConfig } from 'payload/types';
// const { CollectionConfig } = require('payload/types');

// {
//   "seedingActive": "true"/"false" // string
// }

const ContentCmsMeta = {
  slug: 'content_cms_meta',
  // versioning with drafts enabled tells Payload to save documents to a separate collection in the database and allow publishing
  versions: {
    drafts: true,
  },
  fields: [
    {
     name: "seedingActive",
     type: 'text',
     required: true,
     defaultValue: "false"
    },
  ],
}

module.exports = ContentCmsMeta;
