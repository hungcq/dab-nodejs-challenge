const env = require('./env');

const dbConfigs = {
  host: `couchbase://${env.ip}`,
  username: 'dab',
  password: env.pass,
  buckets: {
    actions: 'actions',
    autoIds: 'auto-ids',
  },
  actionIdCounterKey: 'action_counter',
  getActionKey: id => `action_${id}`,
};

module.exports = dbConfigs;
