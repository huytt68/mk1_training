const db = require('../models');
const sendNoti = require('../utils/sendNotification');

const subscribe = async (subscription) => {
	try {
		const { endpoint, expirationTime, keys } = subscription;
		const sub = await db.Subscription.create({
			user_id: 2,
			endpoint,
			expirationTime,
			p256dh_key: keys.p256dh,
			auth_key: keys.auth,
		});
		return { success: true, message: 'OK ', sub };
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

const sendNotification = async (subscription, payload) => {
	try {
		await sendNoti.sendNotification(subscription, payload);
		console.log('Notification sent successfully!');
		return { success: true, message: 'OK ' };
	} catch (error) {
		console.error('Error sending notification:', error);
	}
};

module.exports = {
	sendNotification,
	subscribe,
};
