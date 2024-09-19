const notificationService = require('../services/notificationService');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../utils/errorCodes');

const subscribe = async (req, res, next) => {
	try {
		const { subscription } = req.body;
		console.log(subscription);
		if (!subscription) {
			return res.status(400).json({ error: 'Subscription is required' });
		}
		const result = await notificationService.subscribe(subscription);
		if (!result.success) {
			return res.status(400).json({ message: result.message, subscription: sub });
		}
		res.status(201).json({ message: 'Subscribe push notification successfully!' });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error creating cart:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const sendPushNotification = async (req, res, next) => {
	try {
		const { subscription, message } = req.body;
		console.log(subscription);
		console.log(message);

		if (!subscription || !message) {
			return res.status(400).json({ error: 'Subscription and message are required' });
		}
		const result = await notificationService.sendNotification(
			subscription,
			JSON.stringify({ message })
		);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json({ success: 'Notification sent' });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Failed to send notification:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

module.exports = {
	sendPushNotification,
	subscribe,
};
