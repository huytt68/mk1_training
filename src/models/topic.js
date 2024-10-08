'use strict';
module.exports = (sequelize, DataTypes) => {
	const Topic = sequelize.define(
		'Topic',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		},
		{
			tableName: 'topics',
			timestamps: true,
		}
	);

	Topic.associate = (models) => {
		Topic.hasMany(models.UserSubscription, { as: 'subscriptions', foreignKey: 'topic_id' });
	};

	return Topic;
};
