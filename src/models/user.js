'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			role_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			tableName: 'users',
			timestamps: false,
		}
	);

	User.associate = (models) => {
		User.belongsTo(models.Role, { as: 'role', foreignKey: 'role_id' });
		User.hasMany(models.Cart, { as: 'cart', foreignKey: 'id' });
		User.hasMany(models.Order, { as: 'order', foreignKey: 'id' });
		User.hasMany(models.RefreshToken, { as: 'rtoken', foreignKey: 'id' });
		User.hasMany(models.Token, { as: 'token', foreignKey: 'id' });
	};

	return User;
};
