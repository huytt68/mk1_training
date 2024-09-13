'use strict';
module.exports = (sequelize, DataTypes) => {
	const Order = sequelize.define(
		'Order',
		{
			order_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			total_amount: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			order_status: {
				type: DataTypes.STRING,
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
		Order.belongsTo(models.User, { foreignKey: 'user_id' });
		Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
	};

	return Order;
};
