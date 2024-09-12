'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('User', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			role: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: 'user',
			},
			refreshToken: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('User');
	},
};
