'use strict';
module.exports = (sequelize, DataTypes) => {
	const Subscription = sequelize.define(
		'Subscription',
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
			endpoint: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			expirationTime: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			p256dh_key: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			auth_key: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{ tableName: 'subscriptions', timestamps: false }
	);

	Subscription.associate = function (models) {
		Subscription.belongsTo(models.User, {
			as: 'user',
			foreignKey: 'user_id',
			onDelete: 'CASCADE',
		});
	};

	return Subscription;
};
