// import { CollectionConfig } from 'payload/types';
// const { CollectionConfig } = require('payload/types');

// {
//   orgId: '',
//   pageName: '',
//   key: '',
//   value: '',
//   language: ''
// }

const JurisdictionCms = {
  slug: 'jurisdiction_content_cms',
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
      name: 'pageName',
      type: 'text',
      required: true
    },
    {
      name: 'key',
      type: 'text',
      required: true
    },
    {
    name: 'value',
    type: 'text',
    required: true,
    // localized fields are stored as keyed objects to represent 
    // each locale listed in the payload.config.ts. For example: { en: 'English', es: 'Espanol', ...etc }
    // localized: true,
    },
    {
    name: 'language',
    type: 'text',
    required: true, 
    }
  ],
}

module.exports = JurisdictionCms;
