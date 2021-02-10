const env = require('./env');

const kafkaConfigs = {
  clientId: 'product-service',
  brokers: [`${env.ip}:9092`],
  topic: {
    action: 'action',
  },
  DEFAULT_KEY: 'action',
};

module.exports = kafkaConfigs;
