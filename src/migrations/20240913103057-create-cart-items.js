'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('cart_items', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			cart_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'carts',
					key: 'id',
				},
			},
			product_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'products',
					key: 'id',
				},
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('cart_items');
	},
};
