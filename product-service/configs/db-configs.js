const env = require('./env');

const dbConfigs = {
  host: `couchbase://${env.ip}`,
  username: 'dab',
  password: env.pass,
  buckets: {
    products: 'products',
    autoIds: 'auto-ids',
  },
  productIdCounterKey: 'product_counter',
  productKey: id => `product_${id}`,
};

module.exports = dbConfigs;
