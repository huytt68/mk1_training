const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');
const productCtrl = require('../controllers/productController');
const userCtrl = require('../controllers/userController');
const cartCtrl = require('../controllers/cartController');
const orderCtrl = require('../controllers/orderController');
const notiCtrl = require('../controllers/notificationController');
const checkoutCtrl = require('../controllers/checkoutController');

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
	router.post('/logout', verifyToken, userCtrl.logout);

	router.post('/cart', verifyToken, authorizeRoles('user'), cartCtrl.createCart);
	router.post('/cart/add', verifyToken, authorizeRoles('user'), cartCtrl.addToCart);
	router.get('/cart', verifyToken, authorizeRoles('user'), cartCtrl.getCart);
	router.get('/cartitem', verifyToken, authorizeRoles('user'), cartCtrl.getCartItem);

	router.post('/order', verifyToken, authorizeRoles('user'), orderCtrl.createOrder);
	router.get('/order', verifyToken, authorizeRoles('user'), orderCtrl.getUserOrders);
	router.get('/order/all', verifyToken, authorizeRoles('admin'), orderCtrl.getAllOrders);

	router.post('/register-token', verifyToken, notiCtrl.registerToken);
	router.post('/subscribe-topic', verifyToken, notiCtrl.subscribeTopicNew);
	router.post('/send-notification', verifyToken, notiCtrl.sendTopicNotificationNew);

	router.post('/checkout', checkoutCtrl.createPaymentUrl);
	router.get('/vnpay_ipn', checkoutCtrl.getIPNInfo);

	return app.use('/', router);
};

module.exports = initRoutes;
