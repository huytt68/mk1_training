'use strict';
module.exports = (sequelize, DataTypes) => {
	const UserSubscription = sequelize.define(
		'UserSubscription',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			topic_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Topic',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
		},
		{
			tableName: 'user_subscriptions',
			timestamps: true,
		}
	);

	UserSubscription.associate = (models) => {
		UserSubscription.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
		UserSubscription.belongsTo(models.Topic, { as: 'topic', foreignKey: 'topic_id' });
	};

	return UserSubscription;
};
