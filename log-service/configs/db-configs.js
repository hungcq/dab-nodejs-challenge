const env = require('./env');

const dbConfigs = {
  host: 'couchbase://54.179.157.96',
  username: 'dab',
  password: env.pass,
  buckets: {
    actions: 'actions',
    autoIds: 'auto-ids'
  },
  actionIdCounterKey: 'action_counter',
  getActionKey: id => `action_${id}`,
};

module.exports = dbConfigs;
