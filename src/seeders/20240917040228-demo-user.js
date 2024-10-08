'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'users',
			[
				{
					username: 'admin',
					password: '$2b$10$uSqFA8VN2OPxYyMECVpUpu9vauq40q3KeFXoh.QYxq7C74ESPmnXa',
					email: 'trantronghuy68@gmail.com',
					role_id: 1,
				},
				{
					username: 'huytt1',
					password: '$2b$10$HK.9zxOV.LnbfABJKIEJCO.m67CIRoqNEhyc5pzjlkAXzIOS02TKi',
					email: 'huyttr68@gmail.com',
					role_id: 2,
				},
				{
					username: 'testabc',
					password: '$2b$10$HK.9zxOV.LnbfABJKIEJCO.m67CIRoqNEhyc5pzjlkAXzIOS02TKi',
					email: 'huytt68.1@gmail.com',
					role_id: 2,
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('users', null, {});
	},
};
