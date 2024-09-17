'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'products',
			[
				{
					name: 'IPhone 16',
					price: 20000000,
					stock: 100,
					description: 'Sản phẩm mới nhất của Apple không khác gì bản cũ.',
				},
				{
					name: 'IPhone 16 Pro',
					price: 25000000,
					stock: 100,
					description: 'Sản phẩm mới nhất của Apple không khác gì bản cũ.',
				},
				{
					name: 'IPhone 16 Pro Max',
					price: 30000000,
					stock: 100,
					description: 'Sản phẩm mới nhất của Apple không khác gì bản cũ.',
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('products', null, {});
	},
};
