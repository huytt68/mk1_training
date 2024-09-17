const productService = require('../services/productService');
const CustomError = require('../utils/CustomError');
const ERROR_CODES = require('../utils/errorCodes');

const addProduct = async (req, res, next) => {
	const { name, price, stock, description } = req.body;
	if (!name || !price) {
		return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
	}
	try {
		const result = await productService.addProduct(name, price, stock, description);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error fetching user products:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

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

const getProductById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const product = await productService.getProductById(id);
		res.status(200).json(product);
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error fetching user products:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const updateProduct = async (req, res, next) => {
	try {
		const { id, name, price, stock, description } = req.body;
		if (!id) {
			return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
		}
		const result = await productService.updateProduct(id, name, price, stock, description);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof CustomError) {
			next(error);
		} else {
			console.error('Error fetching user products:', error);
			next(new CustomError(ERROR_CODES.SERVER_ERROR));
		}
	}
};

const deleteProduct = async (req, res, next) => {
	try {
		const { id } = req.body;
		if (!id) {
			return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
		}
		const result = await productService.deleteProduct(id);
		res.status(200).json(result);
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
	addProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
};
