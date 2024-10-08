const { where } = require('sequelize');
const db = require('../models');
const sendMail = require('../utils/sendMail');
const sendNoti = require('../utils/sendNotification');
const paymentUrl = require('../utils/paymentUrl');

const createOrder = async (user_id, returnUrl) => {
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

		try {
			// send mail
			await sendMail.sendOrderConfirmationMail(user.email, orderDetail);
			await sendMail.sendNewOrderNoti(orderDetail);

			// Push notification
			await sendNoti.sendNotiToUser(user_id);
			await sendNoti.sendNotiToAdmin();
		} catch (notiError) {
			console.error('Error sending notification or email:', notiError);
		}
		const orderInfo = `Thanh toan don hang #${order.id}`;
		const clientReturnUrl = returnUrl;
		console.log(clientReturnUrl);
		// Tao payment url
		const paymentUrlResult = await paymentUrl.createPaymentUrl(
			orderDetail.total_amount,
			order.id,
			orderInfo,
			clientReturnUrl
		);
		console.log(paymentUrlResult);
		if (!paymentUrlResult) {
			throw new Error('Failed to create payment URL');
		}

		return {
			success: true,
			message: 'Order created successfully! Please check your email to corfirm your order!',
			orderDetail: orderDetail,
			paymentUrl: paymentUrlResult,
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
