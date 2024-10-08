const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const initRoutes = require('./routes/web');

require('dotenv').config();

const app = express();

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

connectDB();
initRoutes(app);

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
