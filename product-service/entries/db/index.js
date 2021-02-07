const couchbase = require('couchbase');
const dbConfigs = require('../../configs/db-configs');
const { logger } = require('../../utils');

const config = dbConfigs;

let cluster;
let collections = {};

const initCluster = () => {
  cluster = new couchbase.Cluster(config.host, {
    username: config.username,
    password: config.password,
  });

  collections = {};

  for (const key in dbConfigs.buckets) {
    const bucket = dbConfigs.buckets[key];
    collections[bucket] = cluster.bucket(bucket).defaultCollection();
  }
};

initCluster();

const upsert = async (key, doc, bucket) => {
  if (!collections[bucket]) {
    throw new Error('invalid bucket.');
  }
  try {
    return await collections[bucket].upsert(key, doc, { timeout: 5000 });
  } catch (error) {
    logger.error(error);
  }
};

const get = async (key, bucket) => {
  if (!collections[bucket]) {
    throw new Error('invalid bucket.');
  }
  try {
    return await collections[bucket].get(key);
  } catch (error) {
    return null;
  }
};

const remove = async (key, bucket) => {
  if (!collections[bucket]) {
    throw new Error('invalid bucket.');
  }
  try {
    return await collections[bucket].remove(key);
  } catch (e) {
    logger.error(e);
  }
};

const query = async (query, params) => {
  // const query = `SELECT airportname, city FROM \`travel-sample\` WHERE type=$TYPE  AND city=$CITY;`
  // const options = { parameters: { TYPE: 'airport', CITY: 'Reno' } }
  const options = { parameters: params };

  try {
    return await cluster.query(query, options);
  } catch (error) {
    logger.error(error);
    if (error.message === 'parent cluster object has been closed') {
      initCluster();
      return await cluster.query(query, options);
    }
    throw error;
  }
};

const getField = async (key, path, bucket) => {
  try {
    const result = await collections[bucket].lookupIn(key, [couchbase.LookupInSpec.get(path)]);
    return result.content[0].value;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

const autoIncrement = async (key, bucket) => {
  try {
    return await collections[bucket].binary().increment(key, 1);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  upsert,
  get,
  remove,
  query,
  getField,
  autoIncrement,
};
