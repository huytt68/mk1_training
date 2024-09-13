'use strict';
module.exports = (sequelize, DataTypes) => {
	const Cart = sequelize.define(
		'Cart',
		{
			cart_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
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
			tableName: 'carts',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);

	Cart.associate = (models) => {
		Cart.belongsTo(models.User, { foreignKey: 'user_id' });
		Cart.hasMany(models.CartItem, { foreignKey: 'cart_id' });
	};

	return Cart;
};
