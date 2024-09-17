const orderService = require('../services/orderService');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../utils/errorCodes');

const createOrder = async (req, res, next) => {
	try {
		const { _id } = req.user;
		if (!_id) {
			return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
		}
		const result = await orderService.createOrder(_id);
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

const getUserOrder = async (req, res, next) => {
	try {
		const { _id } = req.user;
		if (!_id) {
			return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
		}
		const result = await orderService.getUserOrder(_id);
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
	getUserOrder,
};
