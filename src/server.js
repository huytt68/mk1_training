const express = require('express');
const mysql = require('mysql2');
const connectDB = require('./config/connectDB');
const initRoutes = require('./route/web');

const app = express();

app.use(express.json());

connectDB();
initRoutes(app);

const port = process.env.PORT || 8080;
// // GET /products
// app.get('/products', (req, res) => {
// 	const query = 'SELECT * FROM products';

// 	connection.query(query, (err, results) => {
// 		if (err) {
// 			console.error('Error fetching:', err);
// 			res.status(500).send('Error fetching');
// 			return;
// 		}
// 		res.status(200).json(results);
// 	});
// });

// // Get products by id
// app.get('/products/:id', (req, res) => {
// 	const { id } = req.params;
// 	const query = 'SELECT * FROM products WHERE id=?';

// 	connection.query(query, [id], (err, result) => {
// 		if (err) {
// 			console.error('Error fetching', err);
// 			res.status(500).send('Error fetching');
// 			return;
// 		}
// 		if (result.length === 0) {
// 			res.status(404).send('Product not found!');
// 			return;
// 		}
// 		res.status(200).json(result[0]);
// 	});
// });

// // Create products
// app.post('/products', (req, res) => {
// 	const { name, price, amount } = req.body;
// 	const query = 'INSERT INTO products (name, price, amount) VALUES (?,?,?)';

// 	connection.query(query, [name, price, amount], (err, result) => {
// 		if (err) {
// 			console.error('Error creating', err);
// 			res.status(500).send('Error creating');
// 			return;
// 		}
// 		res.status(201).json({ id: result.insertId, name, price, amount });
// 	});
// });

// // Update product
// app.put('/products/:id', (req, res) => {
// 	const { id } = req.params;
// 	const { name, price, amount } = req.body;
// 	const query = 'UPDATE products SET name=? , price=?, amount=? WHERE id =?';
// 	connection.query(query, [name, price, amount, id], (err, result) => {
// 		if (err) {
// 			console.error('Error updating', err);
// 			res.status(500).send('Error updating');
// 			return;
// 		}
// 		if (result.affectedRows === 0) {
// 			res.status(404).send('Product not found');
// 			return;
// 		}
// 		res.status(200).send('Product updated successfully');
// 	});
// });

// // Delete product
// app.delete('/products/:id', (req, res) => {
// 	const { id } = req.params;
// 	const query = 'DELETE FROM products WHERE id = ?';
// 	connection.query(query, [id], (err, result) => {
// 		if (err) {
// 			console.error('Error deleting', err);
// 			res.status(500).send('Error deleting');
// 			return;
// 		}
// 		if (result.affectedRows === 0) {
// 			res.status(404).send('Product not found');
// 			return;
// 		}
// 		res.status(200).send('Product deleted successfully');
// 	});
// });

// Lắng nghe các request tại cổng 3000
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
