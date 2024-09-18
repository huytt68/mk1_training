const jwt = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');

const generateAccessToken = (uid, email, role_id) =>
	jwt.sign({ _id: uid, email: email, role_id: role_id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION,
	});

const generateRefreshToken = (uid) =>
	jwt.sign({ _id: uid }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRATION,
	});

// Lay userid tu refresh token
const decodeRefreshToken = (refreshToken) => {
	const decodedToken = jwtDecode(refreshToken);
	const userId = decodedToken._id;
	return userId;
};

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	decodeRefreshToken,
};
