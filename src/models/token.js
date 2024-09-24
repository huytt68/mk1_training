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
			token: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{ tableName: 'tokens', timestamps: false }
	);

	Token.associate = function (models) {
		Token.belongsTo(models.User, {
			as: 'user',
			foreignKey: 'user_id',
			onDelete: 'CASCADE',
		});
	};

	return Token;
};
