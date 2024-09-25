'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'topics',
			[
				{
					name: 'news',
				},
				{
					name: 'tech',
				},
				{
					name: 'music',
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('topics', null, {});
	},
};
