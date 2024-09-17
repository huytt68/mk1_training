const { where } = require('sequelize');
const db = require('../models');

const createOrder = async (user_id) => {
	try {
		const cart = await db.Cart.findOne({ where: { user_id, status: 'active' } });
		if (!cart) {
			return { success: false, message: 'Cart not found' };
		}
		// Tao order moi status 'pending'
		const order = await db.Order.create({
			cart_id: cart.id,
			user_id,
			total_amount: cart.total_amount,
			status: 'pending',
		});
		// Cap nhat status cua cart
		await cart.update({ status: 'completed' });
		return { success: true, message: 'Order created successfully' };
	} catch (error) {
		console.error('Error creating cart:', error);
		throw error;
	}
};

const getUserOrder = async (user_id) => {
	try {
		const listOrders = await db.Order.findAll({ where: { user_id } });
		if (!listOrders) {
			return { success: false, message: 'Order not found' };
		}
		return { success: true, listOrders };
	} catch (error) {
		console.error('Error creating cart:', error);
		throw error;
	}
};

module.exports = {
	createOrder,
	getUserOrder,
};
