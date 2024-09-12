const jwt = require('jsonwebtoken');

const generateAccessToken = (uid, email, role) =>
	jwt.sign({ _id: uid, email: email, role: role }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION,
	});

const generateRefreshToken = (uid) =>
	jwt.sign({ _id: uid }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: '7d',
	});

module.exports = {
	generateAccessToken,
	generateRefreshToken,
};
