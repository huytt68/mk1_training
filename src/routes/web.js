const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');
const productCtrl = require('../controllers/productController');
const userCtrl = require('../controllers/userController');
const cartCtrl = require('../controllers/cartController');
const orderCtrl = require('../controllers/orderController');

let router = express.Router();

const initRoutes = (app) => {
	router.get('', (req, res) => {
		return res.send('Hello world!');
	});

	router.post('/products', verifyToken, authorizeRoles('admin'), productCtrl.addProduct);
	router.get('/products', productCtrl.getProducts);
	router.get('/products/:id', productCtrl.getProductById);
	router.put('/products', verifyToken, authorizeRoles('admin'), productCtrl.updateProduct);
	router.delete('/products', verifyToken, authorizeRoles('admin'), productCtrl.deleteProduct);

	router.post('/register', userCtrl.register);
	router.post('/login', userCtrl.loginUser);
	router.post('/refreshtoken', userCtrl.refreshToken);
	router.post('/logout', userCtrl.logout);

	router.post('/cart', verifyToken, authorizeRoles('user'), cartCtrl.createCart);
	router.post('/cart/add', verifyToken, authorizeRoles('user'), cartCtrl.addProductToCart);
	router.get('/cart', verifyToken, authorizeRoles('user'), cartCtrl.getCart);
	router.get('/cartitem', verifyToken, authorizeRoles('user'), cartCtrl.getCartItem);

	router.post('/order', verifyToken, authorizeRoles('user'), orderCtrl.createOrder);
	router.get('/order', verifyToken, authorizeRoles('user'), orderCtrl.getUserOrder);

	return app.use('/', router);
};

module.exports = initRoutes;
