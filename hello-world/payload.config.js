//import path from 'path';

//import { buildConfig } from 'payload/config';
const { buildConfig } = require('payload/config');
const Orders = require('./collections/Orders');
const ContentCms = require('./collections/ContentCms');
const JurisdictionCms = require('./collections/JurisdictionCms'); 
const JurisdictionMeta = require('./collections/JurisdictionMeta'); 

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
  collections: [Orders, ContentCms, JurisdictionCms, JurisdictionMeta],
  localization: {
    locales: ['en', 'es', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },
});
