const userService = require('../services/userService');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../utils/errorCodes');

const register = async (req, res, next) => {
	const { username, password, email } = req.body;
	if (!email || !username || !password) {
		return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
	}
	try {
		const result = await userService.register(username, password, email);
		if (!result.success) {
			res.status(400).json({ message: result.message });
		}
		return res.status(201).json({ message: result.message });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error fetching user products:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const loginUser = async (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
	}
	try {
		const result = await userService.loginUser(username, password, res);

		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		return res.status(200).json({ message: result.message, accessToken: result.accessToken });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error fetching user products:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const refreshToken = async (req, res, next) => {
	const refreshToken = req.cookies.refreshToken; // Lấy Refresh Token từ cookie
	if (!refreshToken) {
		return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
	}
	try {
		const result = await userService.refreshAccessToken(refreshToken);
		if (!result.success) {
			return res.status(401).json({ message: result.message });
		}
		return res.status(200).json({ accessToken: result.accessToken }); // Trả về Access Token mới
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error fetching user products:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const logout = async (req, res, next) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
	}
	try {
		const result = await userService.logoutUser(res, refreshToken); // Xóa cookie chứa Refresh Token
		return res.status(200).json({ message: result.message });
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error fetching user products:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

module.exports = { register, loginUser, refreshToken, logout };
