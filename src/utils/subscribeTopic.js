const db = require('../models');
const axios = require('axios');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];

function getAccessToken() {
	return new Promise(function (resolve, reject) {
		const key = require('../config/nodejs-api-6b198-firebase-adminsdk-xui5t-f6fbfc2f74.json');
		const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES, null);
		jwtClient.authorize(function (err, tokens) {
			if (err) {
				reject(err);
				return;
			}
			resolve(tokens.access_token);
		});
	});
}

// Hàm đăng ký token vào topic sử dụng axios
const subscribeTokenToTopic = async (token, topic) => {
	const url = `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`;
	const accessToken = await getAccessToken();
	try {
		const response = await axios.post(
			url,
			{}, // Không cần gửi body cho yêu cầu này
			{
				headers: {
					access_token_auth: true,
					Authorization: `key=${accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);

		if (response.status === 200) {
			console.log(`Token ${token} đã được đăng ký vào topic: ${topic}`);
		} else {
			console.error(`Lỗi đăng ký vào topic: ${response.statusText}`);
		}
	} catch (error) {
		console.error(
			'Error subscribing to topic:',
			error.response ? error.response.data : error.message
		);
	}
};

module.exports = {
	subscribeTokenToTopic,
};
