'use strict';
module.exports = (sequelize, DataTypes) => {
	const RefreshToken = sequelize.define(
		'RefreshToken',
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
			refresh_token: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			issued_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			expires_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			tableName: 'refresh_tokens',
			timestamps: false,
		}
	);

	RefreshToken.associate = (models) => {
		RefreshToken.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
	};

	return RefreshToken;
};
