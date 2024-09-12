const { where } = require('sequelize');
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
	generateAccessToken,
	generateRefreshToken,
} = require('../middlewares/jwt');

const register = async (email, username, password) => {
	try {
		const existingUser = await db.User.findOne({
			where: { username: username },
		});
		console.log(existingUser);
		if (existingUser) {
			return { success: false, message: 'User already exists' };
		}
		// Hash mật khẩu
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = await db.User.create({
			email,
			username,
			password: hashedPassword,
		});
		return {
			success: true,
			message: 'User registered successfully',
			username: newUser.username,
		};
	} catch (error) {
		console.error('Error during registration:', error);
		throw error;
	}
};

const loginUser = async (username, password, res) => {
	try {
		// Tìm người dùng theo email
		const user = await db.User.findOne({ where: { username } });
		if (!user) {
			return { success: false, message: 'Invalid email or password' };
		}

		// Kiểm tra mật khẩu với bcrypt
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return { success: false, message: 'Invalid email or password' };
		}

		// Tạo access token
		const accessToken = generateAccessToken(user.id, user.email, user.role);
		// Tao refresh token
		const newRefreshToken = generateRefreshToken(user.id);
		// Luu refresh token vao database
		await db.User.update(
			{ refreshToken: newRefreshToken },
			{ where: { id: user.id } }
		);
		// Luu refresh token vao cookie
		res.cookie('refreshToken', newRefreshToken, {
			httpOnly: true, // Cookie chỉ có thể được truy cập bởi máy chủ
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
		});

		return { success: true, message: 'Login successful', accessToken };
	} catch (error) {
		console.error('Error during login:', error);
		throw error;
	}
};

const refreshAccessToken = async (refreshToken) => {
	try {
		const user = await db.User.findOne({ where: { refreshToken } });
		if (!user) {
			return { success: false, message: 'Invalid refresh token' };
		}
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

		// Tạo Access Token mới
		const accessToken = generateAccessToken(
			decoded.id,
			decoded.email,
			decoded.role
		);

		return { success: true, accessToken };
	} catch (err) {
		console.error(err);
		return { success: false, message: 'Invalid refresh token' };
	}
};

const logoutUser = async (res, refreshToken) => {
	try {
		// Xoa refresh token khoi db
		const result = await db.User.update(
			{ refreshToken: null },
			{ where: { refreshToken } }
		);
		if (!result) {
			return { success: false, message: 'Invalid refresh token' };
		}
		res.clearCookie('refreshToken');
		return { success: true, message: 'Logout successful' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Error logout' };
	}
};

module.exports = { register, loginUser, refreshAccessToken, logoutUser };
