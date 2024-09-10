const db = require('../models');

// const getUserProducts = async (userId) => {
// 	try {
// 		const orders = await db.Order.findAll({
// 			where: { user_id: userId },
// 			include: [{ model: db.Product, as: 'Product' }],
// 			raw: true,
// 		});

// 		const formattedOrders = orders.map((order) => {
// 			const {
// 				'Product.id': productId,
// 				'Product.name': productName,
// 				'Product.description': productDescription,
// 				'Product.price': productPrice,
// 				'Product.stock': productStock,
// 				'Product.createdAt': productCreatedAt,
// 				'Product.updatedAt': productUpdatedAt,
// 				...orderData
// 			} = order;

// 			orderData.Product = {
// 				id: productId,
// 				name: productName,
// 				description: productDescription,
// 				price: productPrice,
// 				stock: productStock,
// 				createdAt: productCreatedAt,
// 				updatedAt: productUpdatedAt,
// 			};

// 			return orderData;
// 		});

// 		return formattedOrders;
// 	} catch (error) {
// 		console.error('Error fetching user products:', error);
// 		throw error;
// 	}
// };

const getProducts = async () => {
	try {
		const products = await db.Product.findAll({
			raw: true,
		});

		return products;
	} catch (error) {
		console.error('Error fetching all products:', error);
		throw error;
	}
};

module.exports = {
	getProducts,
};
