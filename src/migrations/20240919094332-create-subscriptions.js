'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Subscriptions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Users', // Tên của bảng User
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			endpoint: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			expirationTime: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			p256dh_key: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			auth_key: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Subscriptions');
	},
};
