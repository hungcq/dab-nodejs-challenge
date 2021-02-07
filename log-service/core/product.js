const dbConfigs = require('../configs/db-configs');
const db = require('../entries/db');
const kafka = require('../entries/kafka');
const kafkaConfigs = require('../configs/kafka-configs');
const { logger } = require('../utils');

const getProducts = async data => {
  if (!data) {
    return { error: 'Data is null.' };
  }
  const { name, minPrice, maxPrice, type } = data;
  let extraQuery = '';
  if (name) {
    extraQuery += ' and contains(name,$name)';
  }
  if (minPrice) {
    extraQuery += ' and price>=$minPrice';
  }
  if (maxPrice) {
    extraQuery += ' and price<=$maxPrice';
  }
  if (type) {
    extraQuery += ' and contains(type,$type)';
  }
  const query = `select * from ${dbConfigs.buckets.products} ${
    extraQuery ? 'where' : ''
  } ${extraQuery}`;
  const params = {
    name,
    minPrice,
    maxPrice,
    type,
  };
  try {
    const result = await db.query(query, params);
    sendActionMsg('search', params);
    return result.rows
      .map(product => product[dbConfigs.buckets.products])
      .filter(item => item.name !== undefined);
  } catch (e) {
    logger.error(e);
    return [];
  }
};

const getProduct = async data => {
  if (!data) {
    return { error: 'Data is null.' };
  }
  const { id } = data;
  if (!id) {
    return { error: 'id is null.' };
  }
  const product = await db.get(dbConfigs.productKey(id), dbConfigs.buckets.products);
  sendActionMsg('viewDetails', { id });
  return product;
};

const addProduct = async data => {
  if (!data) {
    return { error: 'Data is null.' };
  }
  const { name, price, type } = data;
  if (!name) {
    return { error: 'name is null.' };
  }
  if (!price) {
    return { error: 'price is null.' };
  }
  if (!type) {
    return { error: 'type is null.' };
  }
  const { value: id } = await db.autoIncrement(
    dbConfigs.productIdCounterKey,
    dbConfigs.buckets.products
  );
  const product = {
    id,
    name,
    price,
    type,
  };
  const result = await db.upsert(dbConfigs.productKey(id), product, dbConfigs.buckets.products);
  logger.info(result);
  sendActionMsg('add', product);
  return product;
};

const sendActionMsg = async (type, data) => {
  const action = {
    timestamp: new Date().getTime(),
    type,
    data,
  };
  const sendKafkaMsgResult = await kafka.sendMsg(action, kafkaConfigs.topic.action);
  logger.info(sendKafkaMsgResult);
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
};
