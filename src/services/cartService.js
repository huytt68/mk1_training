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

const addToCart = async (user_id, product_id, quantity) => {
	try {
		// 1. Check product
		const product = await db.Product.findOne({
			where: { id: product_id },
		});
		if (!product || product.stock < quantity) {
			return { success: false, message: 'Product not available or not enough stock' };
		}

		// 2. Check gio hang
		const cart = await db.Cart.findOne({
			where: { user_id, status: 'active' },
		});
		if (!cart) {
			cart = await db.Cart.create({ user_id, status: 'active' });
		}

		// 3. Check san pham co trong gio hang chua
		let cartItem = await db.CartItem.findOne({
			where: {
				cart_id: cart.id,
				product_id,
			},
		});
		if (cartItem) {
			cartItem.quantity += quantity;
			await cartItem.save();
		} else {
			cartItem = await db.CartItem.create({
				cart_id: cart.id,
				product_id,
				quantity,
				price: product.price,
			});
		}

		// 4. Cap nhat cart total_amount
		const total_price = parseFloat(cart.total_amount) + parseFloat(product.price) * quantity;
		cart.total_amount = total_price.toFixed(2);
		await cart.save();

		// 5. Cap nhat stock product
		product.stock -= quantity;
		await product.save();

		// 6. Tra ve res
		return {
			success: true,
			message: 'Added product to cart successfully',
			product: {
				id: product.id,
				name: product.name,
				price: product.price,
				quantity: cartItem.quantity,
				description: product.description,
			},
		};
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
		const cart = await db.Cart.findOne({ where: { user_id, status: 'active' } });
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
		const total_amount = cartItems
			.reduce((sum, item) => {
				return (sum += parseFloat(item.quantity) * parseFloat(item.product.price));
			}, 0)
			.toFixed(2);
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
	addToCart,
	getCart,
	getCartItem,
};
