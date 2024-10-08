const orderService = require('../services/orderService');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../utils/errorCodes');

const createOrder = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { returnUrl } = req.body;
		if (!_id) {
			return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
		}
		const result = await orderService.createOrder(_id, returnUrl);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json({
			message: result.message,
			orderDetail: result.orderDetail,
			paymentUrl: result.paymentUrl,
		});
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error creating cart:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const getUserOrders = async (req, res, next) => {
	try {
		const { _id } = req.user;
		if (!_id) {
			return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
		}
		const result = await orderService.getUserOrders(_id);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json(result.listOrders);
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error creating cart:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const getAllOrders = async (req, res, next) => {
	try {
		const result = await orderService.getAllOrders();
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json(result.listOrders);
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
	createOrder,
	getUserOrders,
	getAllOrders,
};
