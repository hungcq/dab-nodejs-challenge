const dbConfigs = require('../configs/db-configs');
const db = require('../entries/db');
const kafka = require('../entries/kafka');
const kafkaConfigs = require('../configs/kafka-configs');
const { logger } = require('../utils');

const getProducts = async data => {
  const validationResult = validateGetInput(data);
  if (!validationResult.success) {
    return validationResult;
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
    return result.rows.map(product => product[dbConfigs.buckets.products]);
  } catch (e) {
    logger.error(e);
    return [];
  }
};

const getProduct = async id => {
  if (!id) {
    return { error: 'id is null.' };
  }
  const result = await db.get(dbConfigs.productKey(id), dbConfigs.buckets.products);
  if (!result) {
    return { error: 'product not exists.' };
  }
  sendActionMsg('viewDetails', { id });
  return result.content;
};

const addProduct = async data => {
  const validationResult = validateProductInput(data);
  if (!validationResult.success) {
    return validationResult;
  }
  const { name, price, type } = data;
  const { value: id } = await db.autoIncrement(
    dbConfigs.productIdCounterKey,
    dbConfigs.buckets.autoIds
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

const validateGetInput = data => {
  if (!data) {
    return {
      success: false,
      error: 'Data is null.',
    };
  }
  return {
    success: true,
  };
};

const validateProductInput = data => {
  if (!data) {
    return {
      success: false,
      error: 'Data is null.',
    };
  }
  const { name, price, type } = data;
  if (!name) {
    return {
      success: false,
      error: 'name is null.',
    };
  }
  if (!price) {
    return {
      success: false,
      error: 'price is null.',
    };
  }
  if (isNaN(price)) {
    return {
      success: false,
      error: 'price must be a number.',
    };
  }
  if (!type) {
    return {
      success: false,
      error: 'type is null.',
    };
  }
  return { success: true };
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
  validateGetInput,
  validateProductInput,
  getProducts,
  getProduct,
  addProduct,
};
