'use strict';
module.exports = (sequelize, DataTypes) => {
	const Cart = sequelize.define(
		'Cart',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
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
				type: DataTypes.ENUM('active', 'completed', 'cancelled'),
				defaultValue: 'active',
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
			tableName: 'carts',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);

	Cart.associate = (models) => {
		Cart.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
		Cart.hasMany(models.CartItem, { as: 'cartitem', foreignKey: 'id' });
		Cart.hasOne(models.Order, { as: 'order', foreignKey: 'id' });
	};

	return Cart;
};
