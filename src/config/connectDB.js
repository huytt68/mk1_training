const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
	process.env.MYSQL_DATABASE,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	{
		host: 'localhost',
		dialect: 'mysql',
		logging: false,
		port: process.env.MYSQL_PORT || 3306,
	}
);

const connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

module.exports = connectDB;
