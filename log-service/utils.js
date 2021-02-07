const path = require('path');

const log4js = require('log4js');
log4js.configure({
  appenders: {
    file: { type: 'file', filename: path.resolve(__dirname, '../log.log') },
    out: { type: 'stdout' },
  },
  categories: {
    default: {
      appenders: ['file', 'out'],
      level: 'info',
    },
  },
});
const logger = log4js.getLogger();

module.exports = {
  logger,
};
