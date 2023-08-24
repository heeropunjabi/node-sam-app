//import { CollectionConfig } from 'payload/types';
//const { CollectionConfig } = require('payload/types');

const Orders = {
  slug: 'orders',
  fields: [
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'imageURL',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'fulfilled',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
};

module.exports = Orders;
