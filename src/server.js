const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB');
const initRoutes = require('./route/web');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();
initRoutes(app);

const port = process.env.PORT || 8080;

// Lắng nghe các request tại cổng 3000
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
