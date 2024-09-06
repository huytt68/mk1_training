const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Cấu hình kết nối MySQL
const connection = mysql.createConnection({
	host: 'mysql', // Tên dịch vụ trong Docker Compose
	user: 'root',
	password: 'password',
	database: 'testdb',
});

// Kết nối đến cơ sở dữ liệu
connection.connect((err) => {
	if (err) {
		console.error('Error connection:', err);
		return;
	}
	console.log('Connected with MySQL!');
});

// Định nghĩa route cơ bản
app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
