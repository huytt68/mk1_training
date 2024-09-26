const db = require('../models');
var admin = require('firebase-admin');
var { getMessaging } = require('firebase-admin/messaging');
require('dotenv').config();

var serviceAccount = require('../config/nodejs-api-6b198-firebase-adminsdk-xui5t-f6fbfc2f74.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const messaging = getMessaging();

const sendNotiToUser = async (user_id) => {
	try {
		const tokenObj = await db.Token.findOne({
			attributes: ['device_token'],
			where: { user_id: user_id },
		});
		if (!tokenObj) {
			console.log('Wrong user id');
			return;
		}
		const message = {
			notification: {
				title: 'Đơn hàng đã đặt thành công!',
				body: 'Tạo đơn hàng thành công! Vui lòng kiểm tra thông tin chi tiết!',
			},
			token: tokenObj.dataValues.device_token,
		};
		const response = await messaging.send(message);
		console.log('Successfully sent message to user: ', response);
		return response;
	} catch (error) {
		console.error('Error sending message to user: ', error);
		throw error;
	}
};

const sendNotiToAdmin = async () => {
	try {
		const adminTokens = await db.Token.findAll({
			attributes: ['device_token'],
			include: {
				model: db.User,
				as: 'user',
				attributes: [],
				required: true,
				include: [
					{
						model: db.Role,
						as: 'role',
						attributes: [],
						where: { name: 'admin' },
					},
				],
			},
		});
		if (!adminTokens) {
			console.log('No admin token found');
			return; // Return early if no admin tokens found to avoid sending empty message to all admins.
		}
		const tokens = adminTokens.map((item) => {
			return item.device_token;
		});
		const message = {
			notification: {
				title: 'Có 1 đơn hàng mới!',
				body: 'Có khách vừa đặt hàng! Hãy kiểm tra!',
			},
			tokens: tokens,
		};
		const response = await messaging.sendEachForMulticast(message);
		console.log('Successfully sent message to admins: ', response);
		return response;
	} catch (error) {
		console.error('Error sending message to admins: ', error);
		throw error;
	}
};

const sendPushNotification = async (deviceTokens, payload) => {
	try {
		const message = {
			notification: payload,
			tokens: deviceTokens,
		};

		const response = await messaging.sendEachForMulticast(message);
		console.log(response);
		return response;
	} catch (error) {
		console.error('Error sending topic noti: ', error);
		throw error;
	}
};

const sendNoti = async (message) => {
	try {
		const response = await messaging.send(message);
		console.log('RESPONSE: ', response);
		return response;
	} catch (error) {
		console.error('Error sending noti: ', error);
		throw error;
	}
};

module.exports = {
	sendNotiToUser,
	sendNotiToAdmin,
	sendPushNotification,
	sendNoti,
};
