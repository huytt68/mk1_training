const { where } = require('sequelize');
const db = require('../models');

const addProduct = async (name, price, stock = 0, description) => {
	try {
		const newProduct = await db.Product.create({
			name,
			price,
			stock,
			description,
		});
		return { message: 'Product added successfully', product: newProduct };
	} catch (error) {
		console.error('Error add product:', error);
		throw error;
	}
};

const getProducts = async () => {
	try {
		const products = await db.Product.findAll({
			raw: true,
		});
		return products;
	} catch (error) {
		console.error('Error fetching all products:', error);
		throw error;
	}
};

const getProductById = async (pid) => {
	try {
		const product = await db.Product.findAll({
			where: { id: pid },
			raw: true,
		});
		return product;
	} catch (error) {
		console.error('Error fetching all products:', error);
		throw error;
	}
};

const updateProduct = async (pid, name, price, stock, description) => {
	try {
		const [updated] = await db.Product.update(
			{
				name,
				price,
				stock,
				description,
			},
			{
				where: { id: pid },
			}
		);
		if (!updated) {
			throw new Error('Product not found');
		}
		const updatedProduct = await db.Product.findByPk(pid);
		return {
			message: 'Product updated successfully',
			product: updatedProduct,
		};
	} catch (error) {
		console.error('Error fetching all products:', error);
		throw error;
	}
};

const deleteProduct = async (pid) => {
	try {
		const deleted = await db.Product.destroy({
			where: { id: pid },
		});
		if (!deleted) {
			throw new Error('Product not found');
		}
		return {
			message: 'Product deleted successfully',
		};
	} catch (error) {
		console.error('Error fetching all products:', error);
		throw error;
	}
};

module.exports = {
	addProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
};
