const checkoutService = require('../services/checkoutService');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../utils/errorCodes');

const getIPNInfo = async (req, res, next) => {
	let vnp_Params = req.query;
	try {
		const result = await checkoutService.getIPNInfo(vnp_Params);
		if (!result.success) {
			return res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
		}
		res.status(200).json({ RspCode: '00', Message: 'success' });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error receive ipn info: ', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

module.exports = {
	getIPNInfo,
};

// 9704198526191432198
// NGUYEN VAN A
// 07/15
// 123456
