'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('order_items', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			order_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'orders',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
			product_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'products',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			price: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('order_items');
	},
};
