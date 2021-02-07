const { Kafka } = require('kafkajs');
const kafkaConfigs = require('../../configs/kafka-configs');
const { logger } = require('../../utils');

const config = kafkaConfigs;

const kafka = new Kafka(config);

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
};

run().catch(e => logger.error(`producer: ${e.message}`, e));

const sendMsg = async (data, topic) => {
  try {
    const response = {
      topic,
      messages: [
        {
          key: kafkaConfigs.DEFAULT_KEY,
          value: JSON.stringify(data),
        },
      ],
    };
    return await producer.send(response);
  } catch (error) {
    return error;
  }
};

module.exports = {
  sendMsg,
};
