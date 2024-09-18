const db = require('../models');

const authorizeRoles = (...roles) => {
	return async (req, res, next) => {
		try {
			const { _id, role_id } = req.user;
			const user = await db.User.findOne({
				where: { id: _id, role_id },
				include: [{ model: db.Role, as: 'role', attributes: ['name'] }],
			});
			if (!user || !roles.includes(user.role.name)) {
				console.log('REQUIRED: ', roles);
				console.log('CURRENT: ', user.role.name);
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
