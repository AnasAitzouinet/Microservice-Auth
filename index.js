const express = require('express');
require('./services/Passport-setup.js');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
require('dotenv').config();

// Instantiating express
const app = express();

// instantianting cors and cookie-session
app.use(
	cors({
		origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', '*'],
		credentials: true,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	})
);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// we need to use sessions to keep track of our user's login status
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,        
		saveUninitialized: true, // Add this line
		cookie: {
			secure: process.env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000 // 24 hours
		}
	}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// Routes
app.get('/auth', (req, res) => {
	res.json("This is Authentication Server. Please use /auth to access the routes.")
})

app.use('/auth', require('./Routes/Auth.js'));

if (process.env.NODE_ENV !== 'test') {
	app.listen(port, '0.0.0.0', function () {
		console.log('Listening on port ' + port);
	})
}
