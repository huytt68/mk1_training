const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');

let router = express.Router();

const initRoutes = (app) => {
	router.get('', (req, res) => {
		return res.send('Hello world!');
	});

	router.post(
		'/products',
		authorizeRoles('admin'),
		verifyToken,
		productController.addProduct
	);
	router.get('/products', productController.getProducts);
	router.get('/products/:id', productController.getProductById);
	router.put(
		'/products',
		verifyToken,
		authorizeRoles('admin'),
		productController.updateProduct
	);
	router.delete(
		'/products',
		verifyToken,
		authorizeRoles('admin'),
		productController.deleteProduct
	);

	router.post('/register', userController.register);
	router.post('/login', userController.loginUser);
	router.post('/refreshtoken', userController.refreshToken);
	router.post('/logout', userController.logout);

	return app.use('/', router);
};

module.exports = initRoutes;
