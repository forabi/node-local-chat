const bonjour = require('bonjour')();
const filter = require('lodash/filter');
const pkg = require('../package.json');

const match = {
  type: 'http',
  txt: {
    localchat: pkg.version,
  },
};

const browser = bonjour.find(match);

const updateServices = () => {
  console.log(filter(browser.services, match));
};

browser.on('up', updateServices);
browser.on('down', updateServices);

browser.start();

