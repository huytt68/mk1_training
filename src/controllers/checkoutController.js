const checkoutService = require('../services/checkoutService');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../utils/errorCodes');

const createPaymentUrl = async (req, res, next) => {
	try {
		const { amount, orderInfo, returnUrl } = req.body;
		const result = await checkoutService.createPaymentUrl(amount, orderInfo, returnUrl);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error creating payment url: ', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const getIPNInfo = async (req, res, next) => {
	let vnp_Params = req.query;
	try {
		const result = await checkoutService.getIPNInfo(vnp_Params);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error creating payment url: ', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

module.exports = {
	createPaymentUrl,
	getIPNInfo,
};
