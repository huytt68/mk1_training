'use strict';
module.exports = (sequelize, DataTypes) => {
	const Product = sequelize.define(
		'Product',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			amount: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},
		{
			tableName: 'Products',
			timestamps: true,
		}
	);

	return Product;
};
