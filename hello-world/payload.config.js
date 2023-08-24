//import path from 'path';

//import { buildConfig } from 'payload/config';
const { buildConfig } = require('payload/config');
const Orders = require('./collections/Orders');

// import Categories from './collections/Categories';
// import Media from './collections/Media';
//import { Orders } from './collections/Orders';

//import Posts from './collections/Posts';
// import Tags from './collections/Tags';
// import Users from './collections/Users';

module.exports = buildConfig({
  // serverURL: 'http://localhost:3000',
  // admin: {
  //   user: Users.slug,
  // },
  collections: [Orders],
  localization: {
    locales: ['en', 'es', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },
});
