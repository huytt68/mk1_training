const db = require('../models');

const registerToken = async (user_id, token) => {
	try {
		const existed = await db.Token.findOne({ where: { token: token } });
		if (!existed) {
			const NewToken = await db.Token.create({
				user_id,
				token,
			});
			return { success: true, message: 'OK ', token: NewToken };
		} else {
			return { success: false, message: 'Token already exists' };
		}
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

module.exports = {
	registerToken,
};
