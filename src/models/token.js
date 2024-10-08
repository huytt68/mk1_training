'use strict';
module.exports = (sequelize, DataTypes) => {
	const Token = sequelize.define(
		'Token',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
			},
			device_token: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		},
		{ tableName: 'tokens', timestamps: false }
	);

	Token.associate = (models) => {
		Token.belongsTo(models.User, {
			as: 'user',
			foreignKey: 'user_id',
			onDelete: 'CASCADE',
		});
	};

	return Token;
};
