const kafkaConfigs = {
  clientId: 'product-service',
  brokers: ['54.179.157.96:9092'],
  topic: {
    action: 'action',
  },
  DEFAULT_KEY: 'action',
};

module.exports = kafkaConfigs;
