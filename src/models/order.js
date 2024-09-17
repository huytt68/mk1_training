'use strict';
module.exports = (sequelize, DataTypes) => {
	const Order = sequelize.define(
		'Order',
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
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			total_amount: {
				type: DataTypes.DECIMAL(20, 2),
				allowNull: false,
				defaultValue: 0,
			},
			status: {
				type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
				defaultValue: 'pending',
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
			tableName: 'orders',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);

	Order.associate = (models) => {
		Order.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
		Order.belongsTo(models.Cart, { as: 'cart', foreignKey: 'cart_id' });
	};

	return Order;
};
