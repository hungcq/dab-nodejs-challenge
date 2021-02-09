const dbConfigs = require('../configs/db-configs');
const db = require('../entries/db');
const { logger } = require('../utils');

const getActions = async data => {
  const query = `select * from ${dbConfigs.buckets.actions}`;
  try {
    const result = await db.query(query);
    return result.rows.map(item => item[dbConfigs.buckets.actions]);
  } catch (e) {
    logger.error(e);
    return [];
  }
};

const addAction = async payload => {
  const validationResult = validateActionInput(payload);
  if (!validationResult.success) {
    return validationResult;
  }
  const { timestamp, type, data } = payload;
  const { value: id } = await db.autoIncrement(
    dbConfigs.actionIdCounterKey,
    dbConfigs.buckets.autoIds
  );
  const product = {
    id,
    timestamp,
    type,
    data,
  };
  const result = await db.upsert(dbConfigs.getActionKey(id), product, dbConfigs.buckets.actions);
  logger.info(result);
  return product;
};

const validateActionInput = payload => {
  if (!payload) {
    return {
      success: false,
      error: 'Data is null.',
    };
  }
  const { timestamp, type } = payload;
  if (!timestamp) {
    return {
      success: false,
      error: 'timestamp is null.',
    };
  }
  if (isNaN(timestamp)) {
    return {
      success: false,
      error: 'timestamp is not a number.',
    };
  }
  if (!type) {
    return {
      success: false,
      error: 'type is null.',
    };
  }
  return {
    success: true,
  };
};

module.exports = {
  validateActionInput,
  getActions,
  addAction,
};
