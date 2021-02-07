const env = require('./env');

const dbConfigs = {
  host: 'couchbase://54.179.157.96',
  username: 'dab',
  password: env.pass,
  buckets: {
    products: 'products',
  },
  productIdCounterKey: 'counter',
  productKey: id => `product_${id}`,
};

module.exports = dbConfigs;
