const { where } = require('sequelize');
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
	generateAccessToken,
	generateRefreshToken,
	decodeRefreshToken,
} = require('../middlewares/jwt');

const register = async (username, password, email) => {
	try {
		const existingUser = await db.User.findOne({
			where: { username: username },
		});
		// console.log(existingUser);
		if (existingUser) {
			return { success: false, message: 'User already exists' };
		}
		// Hash mật khẩu
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = await db.User.create({
			username,
			password: hashedPassword,
			email,
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
		// Tìm user theo username
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
		const accessToken = generateAccessToken(user.id, user.email, user.role_id);
		// Tao + hash refresh token
		const newRefreshToken = generateRefreshToken(user.id);
		const salt = await bcrypt.genSalt(10);
		const hashedRefreshToken = await bcrypt.hash(newRefreshToken, salt);
		// Expired 7 days
		const expires_at = new Date();
		expires_at.setDate(expires_at.getDate() + 7);
		// Luu refresh token vao database
		await db.RefreshToken.create({
			user_id: user.id,
			refresh_token: hashedRefreshToken,
			expires_at,
		});

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
		const userId = decodeRefreshToken(refreshToken);
		const users = await db.RefreshToken.findAll({
			attributes: ['refresh_token', 'expires_at'],
			where: { user_id: userId },
		});
		if (users.length === 0) {
			return { success: false, message: 'Invalid refresh token' };
		}
		// so sanh tung token
		for (const user of users) {
			// So sánh token gửi lên với các token đã mã hóa
			const isMatch = await bcrypt.compare(refreshToken, user.dataValues.refresh_token);
			if (isMatch) {
				// Kiểm tra thời gian hết hạn
				if (new Date(user.expires_at) < new Date()) {
					return { success: false, message: 'Refresh token expired or revoked' };
				}
				const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
				// Tạo Access Token mới
				const accessToken = generateAccessToken(decoded.id, decoded.email, decoded.role);
				return { success: true, accessToken };
			}
		}
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Invalid refresh token' };
	}
};

// const refreshAccessToken = async (refreshToken) => {
// 	try {
// 		const verificationResult = await verifyRefreshToken(refreshToken);

// 		if (verificationResult.success) {
// 			const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
// 			// Tạo Access Token mới
// 			const accessToken = generateAccessToken(decoded.id, decoded.email, decoded.role);
// 			return { success: true, accessToken };
// 		} else {
// 			return { success: false, message: verificationResult.message };
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		return { success: false, message: 'Error logout' };
// 	}
// };

const logoutUser = async (res, refreshToken) => {
	try {
		const userId = decodeRefreshToken(refreshToken);
		const users = await db.RefreshToken.findAll({
			attributes: ['refresh_token'],
			where: { user_id: userId },
		});
		if (users.length === 0) {
			return { success: false, message: 'Invalid refresh token' };
		}
		// so sanh tung token
		for (const user of users) {
			// So sánh token gửi lên với các token đã mã hóa
			const isMatch = await bcrypt.compare(refreshToken, user.dataValues.refresh_token);
			if (isMatch) {
				// Xoa refresh token khoi db
				const result = await db.RefreshToken.destroy({
					where: { refresh_token: user.dataValues.refresh_token },
				});
				if (!result) {
					return { success: false, message: 'Invalid refresh token1' };
				}
				res.clearCookie('refreshToken');
				return { success: true, message: 'Logout successful' };
			}
		}
	} catch (error) {
		console.error(TypeError);
		return { success: false, message: 'Invalid refresh token' };
	}
};

module.exports = { register, loginUser, refreshAccessToken, logoutUser };
