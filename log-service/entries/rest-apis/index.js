const express = require('express');
const bodyParser = require('body-parser');
const { logger } = require('../../utils');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/products', require('./product-router').router);

app.use('/log', express.static(path.join(__dirname, '../../../log.log')));

app.get('/', (req, res) => res.send('Product Service'));

app.use('*', (req, res) => res.status(404).send('Invalid path'));

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => logger.info(`Product Service is listening on port ${PORT}.`));
