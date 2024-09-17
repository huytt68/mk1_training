const cartService = require('../services/cartService');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../utils/errorCodes');

const createCart = async (req, res, next) => {
	try {
		const { _id } = req.user;
		if (!_id) {
			return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
		}
		const result = await cartService.createCart(_id);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json({ message: result.message });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error creating cart:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const addProductToCart = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { product_id } = req.body;

		if (!product_id) {
			return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
		}
		const result = await cartService.addProductToCart(_id, product_id);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json({ message: result.message });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error creating cart:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const getCart = async (req, res, next) => {
	try {
		const { _id } = req.user;
		if (!_id) {
			return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
		}
		const result = await cartService.getCart(_id);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json(result.cart);
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error creating cart:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const getCartItem = async (req, res, next) => {
	try {
		const { _id } = req.user;
		if (!_id) {
			return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
		}
		const result = await cartService.getCartItem(_id);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json(result.cartItems);
		// res.status(200).json({ message: result.message });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error creating cart:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

module.exports = {
	createCart,
	addProductToCart,
	getCart,
	getCartItem,
};
