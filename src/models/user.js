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
		User.belongsTo(models.Role, { foreignKey: 'role_id' });
		User.hasOne(models.Cart, { foreignKey: 'user_id' });
		User.hasMany(models.Order, { foreignKey: 'user_id' });
	};

	return User;
};
