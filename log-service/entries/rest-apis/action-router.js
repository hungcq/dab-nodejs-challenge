const express = require('express');
const action = require('../../core/action');

const router = express.Router();

router.get('/', (req, res) => {
  action.getActions(req.query).then(result => res.json(result));
});

module.exports = { router };
