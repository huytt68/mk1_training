const db = require('../models');

const authorizeRoles = (...roles) => {
	return async (req, res, next) => {
		try {
			// console.log(req.user._id);
			const user = await db.User.findOne({
				where: { id: req.user._id },
				include: [{ model: db.Role, as: 'role', attributes: [] }],
				attributes: {
					include: [[db.Sequelize.col('role.name'), 'role']],
				},
				raw: true,
			});
			// console.log(user);
			if (!user || !roles.includes(user.role)) {
				console.log('REQUIRED: ', roles);
				console.log('have: ', user.role);
				return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
			}

			next();
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Server error during authorization' });
		}
	};
};

module.exports = authorizeRoles;
