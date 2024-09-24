const notificationService = require('../services/notificationService');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../utils/errorCodes');

const registerToken = async (req, res, next) => {
	try {
		const { token } = req.body;
		const { _id } = req.user;
		if (!token) {
			return res.status(400).json({ error: 'Token is required' });
		}
		const result = await notificationService.registerToken(_id, token);
		if (!result.success) {
			return res.status(201).json({ message: result.message, token: token });
		}
		res.status(201).json({ message: 'Token push notification register successfully!' });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error register token:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

module.exports = {
	registerToken,
};
