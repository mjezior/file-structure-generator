const chalk = require('chalk');

const _isArray = require('lodash/isArray');

module.exports = logger = {
  log: (...messages) => {
    messages = messages.map((message) => {
      if (_isArray(message)) {
        return message[1] ? chalk[message[1]](message[0]) : message[0];
      } else {
        return message;
      }
    });
    console.log(...messages); // eslint-disable-line no-console
  }
};
