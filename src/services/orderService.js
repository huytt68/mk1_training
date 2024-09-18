const { where } = require('sequelize');
const db = require('../models');
const sendMail = require('../utils/sendMail');

const createOrder = async (user_id) => {
	try {
		// 1. Check gio hang ton tai
		const cart = await db.Cart.findOne({ where: { user_id, status: 'active' } });
		if (!cart) {
			return { success: false, message: 'Cart not found' };
		}

		// 2. Check gio hang rong
		const cartItems = await db.CartItem.findAll({
			attributes: ['id', 'quantity'],
			include: [
				{
					model: db.Cart,
					as: 'cart',
					attributes: [],
					where: {
						id: cart.id,
					},
				},
				{
					model: db.Product,
					as: 'product',
					attributes: ['id', 'name', 'price'],
				},
			],
		});
		if (cartItems.length == 0) {
			return { success: false, message: 'Cart is empty' };
		}

		// 3. Tao order moi status 'pending'
		const order = await db.Order.create({
			cart_id: cart.id,
			user_id,
			total_amount: cart.total_amount,
			status: 'pending',
		});
		// 4. Cap nhat status cua cart
		await cart.update({ status: 'completed' });

		// 5. Tao cart active moi
		await db.Cart.create({ user_id, status: 'active' });

		// 6. Gui mail xac nhan
		const user = await db.User.findOne({ where: { id: user_id } });
		const orderDetail = {
			order_id: order.id,
			user: {
				id: user_id,
				username: user.username,
			},
			total_amount: cart.total_amount,
			status: order.status,
			created_at: order.created_at,
			items: cartItems.map((item) => ({
				id: item.product.id,
				name: item.product.name,
				price: item.product.price,
				quantity: item.quantity,
			})),
		};
		// Gui mail cho user
		await sendMail.sendOrderConfirmationMail(user.email, orderDetail);
		// Gui noti cho admin
		await sendMail.sendNewOrderNoti(orderDetail);

		return {
			success: true,
			message: 'Order created successfully! Please check your email to corfirm your order!',
			orderDetail,
		};
	} catch (error) {
		console.error('Error creating cart:', error);
		throw error;
	}
};

const getUserOrders = async (user_id) => {
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

const getAllOrders = async () => {
	try {
		const listOrders = await db.Order.findAll();
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
	getUserOrders,
	getAllOrders,
};
