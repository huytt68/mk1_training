const Sequelize = require('sequelize');

const sequelize = new Sequelize('dev_db', 'root', 'password', {
	host: 'mysql',
	dialect: 'mysql',
	logging: false,
	port: 3306,
});

const connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

module.exports = connectDB;
