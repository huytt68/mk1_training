const webpush = require('web-push');
const db = require('../models');
require('dotenv').config();

// Thiết lập VAPID keys
const publicVapidKey = process.env.YOUR_PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.YOUR_PRIVATE_VAPID_KEY;

webpush.setVapidDetails('mailto:huytt68.3@gmail.com', publicVapidKey, privateVapidKey);

const sendNotification = async (subscription, payload) => {
	try {
		await webpush.sendNotification(subscription, payload);
		console.log('Notification sent successfully');
	} catch (error) {
		console.error('Error sending notification:', error);
		throw error;
	}
};

const sendNotiToUserId = async (user_id, payload) => {
	try {
		const subData = await db.Subscription.findOne({ where: { user_id: user_id } });
		if (!subData) {
			console.log('Wrong user id');
			return;
		}
		const subscription = {
			endpoint: subData.endpoint,
			expirationTime: subData.expirationTime,
			keys: {
				p256dh: subData.p256dh_key,
				auth: subData.auth_key,
			},
		};
		await webpush.sendNotification(subscription, payload);
	} catch (error) {
		console.error('Error sending notification:', error);
		throw error;
	}
};

const sendNotiToAdmin = async (payload) => {
	try {
		const subData = await db.Subscription.findAll({
			include: {
				model: db.User,
				as: 'user',
				attribute: [],
				include: {
					model: db.Role,
					as: 'role',
					attribute: [],
					where: { name: 'admin' },
				},
			},
		});
		const adminSubscriptions = subData.map((item) => {
			return {
				endpoint: item.endpoint,
				expirationTime: item.expirationTime,
				keys: {
					p256dh: item.p256dh_key,
					auth: item.auth_key,
				},
			};
		});
		console.log(adminSubscriptions);
		for (let subscription of adminSubscriptions) {
			await sendNotification(subscription, payload);
		}
	} catch (error) {
		console.error('Error sending notification:', error);
		throw error;
	}
};

module.exports = {
	sendNotification,
	sendNotiToUserId,
	sendNotiToAdmin,
};
