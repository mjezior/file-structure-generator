const chalk = require('chalk');

const _isArray = require('lodash/isArray');
const _reduce = require('lodash/reduce');

module.exports = logger = {
  log: (...messages) => {
    messages = messages.map((message) => {
      if (_isArray(message)) {
        if (message.length > 1) {
          const messageText = message.shift();
          const chalkChain = _reduce(message, (chain, method) => (
            chain[method]
          ), chalk);
          return chalkChain(messageText);
        } else {
          return message[0];
        }
      } else {
        return message;
      }
    });
    console.log(...messages); // eslint-disable-line no-console
  }
};
