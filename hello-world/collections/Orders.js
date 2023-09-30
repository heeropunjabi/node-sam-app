// import { CollectionConfig } from 'payload/types';
const { CollectionConfig } = require('payload/types');

const Orders = {
  slug: 'orders',
  // versioning with drafts enabled tells Payload to save documents to a separate collection in the database and allow publishing
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'key',
      type: 'text',
      localized: true,
    },
    {
      name: 'value',
      type: 'json'
    },
    // {
    //   name: 'items',
    //   type: 'array',
    //   fields: [
    //     {
    //       name: 'product',
    //       type: 'text',
    //       required: true,
    //       localized: true,
    //     },
    //     {
    //       name: 'quantity',
    //       type: 'number',
    //       required: true,
    //     },
    //     {
    //       name: 'imageURL',
    //       type: 'text',
    //       required: true,
    //       localized: true,
    //     },
    //   ],
    // },
    // {
    //   name: 'fulfilled',
    //   type: 'checkbox',
    //   defaultValue: false,
    // },
  ],
};

module.exports = Orders;
