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
			return res.status(201).json(result.message);
		}
		res.status(201).json({ message: result.message, token: result.device_token });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error register token:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const subscribeTopic = async (req, res, next) => {
	try {
		const { topic } = req.body;
		const { _id } = req.user;
		if (!topic) {
			return res.status(400).json({ error: 'Topic is required' });
		}
		const result = await notificationService.subscribeTopic(_id, topic);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(201).json({
			message: result.message,
			subscription: result.subscription,
		});
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error subscribe topic: ', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const subscribeTopicNew = async (req, res, next) => {
	try {
		const { topic, token } = req.body;
		if (!topic) {
			return res.status(400).json({ error: 'Topic is required' });
		}
		const result = await notificationService.subscribeTopicNew(topic, token);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(201).json({
			message: result.message,
			subscription: result.subscription,
		});
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error subscribe topic: ', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const sendTopicNotification = async (req, res, next) => {
	try {
		const { topic, title, message } = req.body;
		if (!topic) {
			return res.status(400).json({ error: 'Topic is required' });
		}
		const result = await notificationService.sendTopicNotification(topic, title, message);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json({ message: result.message });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error send topic noti: ', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const sendTopicNotificationNew = async (req, res, next) => {
	try {
		const { topic, title, body } = req.body;
		if (!topic) {
			return res.status(400).json({ error: 'Topic is required' });
		}
		const result = await notificationService.sendTopicNotificationNew(topic, title, body);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json({ message: result.message });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error send topic noti: ', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

module.exports = {
	registerToken,
	subscribeTopic,
	subscribeTopicNew,
	sendTopicNotification,
	sendTopicNotificationNew,
};
