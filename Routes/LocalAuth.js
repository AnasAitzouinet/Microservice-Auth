const express = require('express');
const router = express.Router();
var passport = require('passport');
const flash = require('connect-flash');
router.use(flash());
const prisma = require('../lib/prisma.js');


// TODO - Add a route to handle Registration
router.post('/register', async(req, res) => {
    const { email, password } = req.body;


    await prisma.user.create({
        data: {
            email,
            password: "req.body.passwordxs"
        }
    }).then((data) => {
        res.status(200).json({
            error: false,
            message: "Successfully Registered",
            user: data,
        });
    }).catch((error) => {
        res.status(500).json({
            error: true,
            message: "Failed to register",
            error: error,
        });
    });
    // res.send('Register route');
});

// Login using local strategy
router.post('/login', passport.authenticate('local', {
    failureFlash: true // Enable flash messages for authentication failures
}), (req, res) => {
    console.log("etst");
    if (req.user.Error) {
        res.status(401).json({ error: true, message: req.user.Error });
    } else if(req.user && !req.user.Error) {
        // Authentication successful
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            user: req.user,
        });
    }
});




const LocalAuth = router
module.exports = router;