'use strict';
module.exports = (sequelize, DataTypes) => {
	const Product = sequelize.define(
		'Product',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			stock: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			description: {
				type: DataTypes.TEXT,
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			tableName: 'products',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);

	Product.associate = (models) => {
		Product.hasMany(models.CartItem, { foreignKey: 'id' });
		Product.hasMany(models.OrderItem, { foreignKey: 'id' });
	};

	return Product;
};
