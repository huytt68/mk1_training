const db = require('../models');
const sendNoti = require('../utils/sendNotification');
const subTopic = require('../utils/subscribeTopic');

const registerToken = async (user_id, token) => {
	try {
		const existed = await db.Token.findOne({ where: { device_token: token } });
		if (!existed) {
			const NewToken = await db.Token.create({
				user_id,
				device_token: token,
			});
			return { success: true, message: 'Token FCM register successfully ', device_token: NewToken };
		} else {
			return { success: false, message: 'Token already exists' };
		}
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

const subscribeTopic = async (user_id, topic_name) => {
	try {
		const topic = await db.Topic.findOne({ where: { name: topic_name } });
		const existed = await db.UserSubscription.findOne({
			where: {
				user_id: user_id,
				topic_id: topic.id,
			},
		});
		if (!existed) {
			const newSubscription = await db.UserSubscription.create({
				user_id,
				topic_id: topic.id,
			});
			console.log(newSubscription);
			return { success: true, message: 'OK ', subscription: newSubscription };
		} else {
			return { success: false, message: 'User has already subscribe topic before' };
		}
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

const subscribeTopicNew = async (topic, token) => {
	try {
		await subTopic.subscribeTokenToTopic(token, topic);
		return { success: true, message: `Subscribe ${topic} successfully!` };
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

const sendTopicNotification = async (topic_name, title, message) => {
	try {
		const topic = await db.Topic.findOne({ where: { name: topic_name } });
		if (!topic) {
			return { success: false, message: 'Topic not found' };
		}
		const subscriptions = await db.UserSubscription.findAll({
			where: { topic_id: topic.id },
		});
		const userIds = subscriptions.map((sub) => sub.user_id);
		const subscribeTokens = await db.Token.findAll({ where: { user_id: userIds } });
		const tokens = subscribeTokens.map((item) => {
			return item.device_token;
		});
		const notificationPayload = {
			title: title,
			body: message,
		};
		try {
			await sendNoti.sendPushNotification(tokens, notificationPayload);
		} catch (notiError) {
			console.error('Error sending notification or email:', notiError);
			return { success: false, message: 'Send noti failed' };
		}
		return { success: true, message: 'Send topic notification successfully!' };
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

const sendTopicNotificationNew = async (topic, title, body) => {
	try {
		const message = {
			notification: {
				title: title,
				body: body,
			},
			topic: topic,
		};
		console.log(message);
		try {
			const result = await sendNoti.sendNoti(message);
			console.log('AT SERVICE: ', result);
		} catch (notiError) {
			console.error('Error sending notification:', notiError);
			return { success: false, message: 'Send noti failed' };
		}
		return { success: true, message: 'Send topic notification by FCM topic successfully!' };
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

module.exports = {
	registerToken,
	subscribeTopic,
	subscribeTopicNew,
	sendTopicNotification,
	sendTopicNotificationNew,
};
