const express = require('express');
const GoogleService = require('./services/Passport-setup.js');
const cors = require('cors');
const cookieSession = require("cookie-session");
const passport = require('passport');
const bodyParser = require('body-parser');

// Instantiating express
const app = express();

// instantianting cors and cookie-session
app.use(
	cors({
		origin: ["http://localhost:3001",'*'],
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// we need to use sessions to keep track of our user's login status
app.use(
	cookieSession({
		name: "RefSession",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./Routes/Auth.js'));

// Home route
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
