const { where } = require('sequelize');
const db = require('../models');
const { raw } = require('mysql2');

const createCart = async (user_id) => {
	try {
		const existingCart = await db.Cart.findOne({ where: { user_id, status: 'active' } });
		if (existingCart) {
			return { success: false, message: 'User already has an active cart' };
		}
		await db.Cart.create({ user_id, status: 'active' });
		return { success: true, message: 'Cart created successfully' };
	} catch (error) {
		console.error('Error creating cart:', error);
		throw error;
	}
};

const addProductToCart = async (user_id, product_id) => {
	try {
		const cart = await db.Cart.findOne({
			where: { user_id, status: 'active' },
		});
		if (!cart) {
			return { success: false, message: 'Cart not found' };
		}
		const cartItem = await db.CartItem.findOne({
			where: {
				cart_id: cart.id,
				product_id,
			},
		});
		const product = await db.Product.findOne({
			where: { id: product_id },
		});
		if (cartItem) {
			cartItem.quantity += 1;
			await cartItem.save();
		} else {
			await db.CartItem.create({
				cart_id: cart.id,
				product_id,
				price: product.price,
			});
		}
		return { success: true, message: 'Cart updated successfully' };
	} catch (error) {
		console.error('Error updating cart:', error);
		throw error;
	}
};

const getCart = async (user_id) => {
	try {
		const cart = await db.Cart.findOne({ where: { user_id, status: 'active' } });
		if (!cart) {
			return { success: false, message: 'Cart not found' };
		}
		return { success: true, message: 'Get cart successfully', cart: cart };
	} catch (error) {
		console.error('Error getting cart:', error);
		throw error;
	}
};

const getCartItem = async (user_id) => {
	try {
		const cartItems = await db.CartItem.findAll({
			attributes: ['id', 'quantity'],
			include: [
				{
					model: db.Cart,
					as: 'cart',
					attributes: [],
					include: [
						{
							model: db.User,
							as: 'user',
							attributes: [],
							where: {
								id: user_id,
							},
						},
					],
				},
				{
					model: db.Product,
					as: 'product',
					attributes: ['name', 'price'],
				},
			],
		});
		const total_amount = cartItems
			.reduce((sum, item) => {
				return (sum += parseFloat(item.quantity) * parseFloat(item.product.price));
			}, 0)
			.toFixed(2);
		const cart = await db.Cart.findOne({ where: { user_id, status: 'active' } });
		cart.total_amount = total_amount;
		await cart.save();

		if (!cartItems) {
			return { success: false, message: 'Cart not found' };
		}
		return { success: true, message: total_amount, cartItems };
	} catch (error) {
		console.error('Error getting cart item:', error);
		throw error;
	}
};
module.exports = {
	createCart,
	addProductToCart,
	getCart,
	getCartItem,
};
