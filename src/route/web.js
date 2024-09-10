const express = require('express');
const productController = require('../controllers/productController');

let router = express.Router();

const initRoutes = (app) => {
	router.get('/products', productController.getProducts);
};

module.exports = initRoutes;
