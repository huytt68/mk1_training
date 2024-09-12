const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../utils/errorCodes');

const verifyToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Access token missing or invalid' });
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
		if (error) {
			throw new CustomError(ERROR_CODES.TOKEN_ERROR);
		}
		req.user = user;

		next();
	});
};

module.exports = verifyToken;
