const { Kafka } = require('kafkajs');
const kafkaConfigs = require('../../configs/kafka-configs');
const { logger } = require('../../utils');
const action = require('../../core/action');

const kafka = new Kafka(kafkaConfigs);

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: 'log',
  maxWaitTimeInMs: 300,
});

const run = async () => {
  await producer.connect();

  await consumer.connect();
  await consumer.subscribe({
    topic: kafkaConfigs.topic.action,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        handleMessage(data);
      } catch (e) {
        logger.error(e);
      }
    },
  });
};

const handleMessage = data => {
  action.addAction(data).then(result => logger.info(result));
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
