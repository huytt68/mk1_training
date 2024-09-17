'use strict';
module.exports = (sequelize, DataTypes) => {
	const CartItem = sequelize.define(
		'CartItem',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			cart_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			product_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			price: {
				type: DataTypes.DECIMAL(20, 2),
				allowNull: false,
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
			tableName: 'cart_items',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);

	CartItem.associate = (models) => {
		CartItem.belongsTo(models.Cart, { as: 'cart', foreignKey: 'cart_id' });
		CartItem.belongsTo(models.Product, { as: 'product', foreignKey: 'product_id' });
	};

	return CartItem;
};
