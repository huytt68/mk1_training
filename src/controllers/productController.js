const productService = require('../services/productService');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../errorCodes');

const getProducts = async (req, res, next) => {
	try {
		const products = await productService.getProducts();
		res.status(200).json(products);
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error fetching user products:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

module.exports = {
	getProducts,
};
