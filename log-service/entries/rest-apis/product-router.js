const express = require('express');
const product = require('../../core/product');

const router = express.Router();

router.get('/', (req, res) => {
  product.getProducts(req.query).then(result => res.json(result));
});

router.get('/:id', (req, res) => {
  product.getProduct(req.query).then(result => res.json(result));
});

router.post('/', (req, res) => {
  product.addProduct(req.body).then(result => res.json(result));
});

module.exports = { router };
