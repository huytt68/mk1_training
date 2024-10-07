'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'products',
			[
				{
					name: 'Product A',
					price: 10000,
					stock: 100,
					description: 'Sản phẩm 1 của cửa hàng.',
				},
				{
					name: 'Product B',
					price: 20000,
					stock: 100,
					description: 'Sản phẩm 2 của cửa hàng.',
				},
				{
					name: 'Product C',
					price: 30000,
					stock: 100,
					description: 'Sản phẩm 3 của cửa hàng.',
				},
				{
					name: 'Product D',
					price: 25000,
					stock: 100,
					description: 'Sản phẩm 4 của cửa hàng.',
				},
				{
					name: 'Product E',
					price: 50000,
					stock: 100,
					description: 'Sản phẩm 5 của cửa hàng.',
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('products', null, {});
	},
};
