var { getMessaging } = require('firebase-admin/messaging');

const subscribeTokenToTopic = async (token, topic) => {
	try {
		getMessaging()
			.subscribeToTopic(token, topic)
			.then((response) => {
				console.log('Successfully subscribed to topic:', response);
			})
			.catch((error) => {
				console.log('Error subscribing to topic:', error);
			});
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
