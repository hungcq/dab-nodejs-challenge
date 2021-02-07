const { Kafka } = require('kafkajs');
const kafkaConfigs = require('../../configs/kafka-configs');
const { logger } = require('../../utils');

const config = kafkaConfigs;

const kafka = new Kafka(config);

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: 'tour',
  maxWaitTimeInMs: 300,
});

const run = async () => {
  await producer.connect();

  await consumer.connect();
  await consumer.subscribe({
    topic: kafkaConfigs.topic.request,
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
  const { actionTypes } = kafkaConfigs;
  switch (data.actionType) {
    case actionTypes.GET_ALL_TOUR:
      tour.setTourList(data);
      break;
    case actionTypes.UPDATE_STATUS:
      tour.updateStatus(data);
      break;
    case actionTypes.MINUTE_STATUS:
      tour.updateMinuteStatus(data);
      break;
    case actionTypes.UPDATE_BRACKET:
      tour.updateBracket(data);
      break;
    case actionTypes.CREATE_TOUR:
      tour.createTour(data);
      break;
    case actionTypes.START_TOUR:
      tour.startTour(data);
      break;
    case actionTypes.FINISH_TOUR:
      tour.finishTour(data).catch(e => logger.error(e));
      break;
    case actionTypes.REGISTER_OUTGIFT:
      register.register(data).catch(e => logger.error(e));
      break;
    case actionTypes.GET_REGISTER_INFOS:
      register.getRegisterData(data).then(result => {
        sendMsg({ actionType: data.actionType, data: result }, `${data.gameId}Response`).catch(e =>
          logger.error(e)
        );
      });
      break;
    default:
      break;
  }
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
