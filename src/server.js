const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const initRoutes = require('./routes/web');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();
initRoutes(app);

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
