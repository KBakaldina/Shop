const facebook = require('facebook-node-sdk');

let fb = new facebook({appID: process.env.FB_API_KEY, secret: process.env.FB_API_SECRET});

module.exports = fb;