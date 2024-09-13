'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('roles', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('roles');
	},
};
