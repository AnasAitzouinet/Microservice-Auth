const express = require('express');
const router = express.Router();
const linkedinRouter = require('./Linkedin.js');
const googleRouter = require('./Google.js');
const LocalAuth = require('./LocalAuth.js');

router.use('/', linkedinRouter);
router.use('/', googleRouter);
router.use('/', LocalAuth);

// After logging in, the front end will make a request to this route to check if the user is logged in it will return the user object
router.get("/login/retrieve", (req, res) => {
    console.log(req.user);
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

// If the user fails to log in, the front end will make a request to this route
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: ` Failed to log in : ${req.user.Error}`,
    });
});

// Logout route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("http://localhost:3001");
});

const Auth = router
module.exports = router;