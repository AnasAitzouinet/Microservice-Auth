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
     if (!req.user) {
        res.status(404).json({ error: true, message: "User not logged in 1" });
    } else
        if (req.user.Error === "User does not exist" || req.user.Error === "This email is linked to an account created by Linkedin" || req.user.Error === "Invalid email or password") {
        console.log(req.user +" error");
           
            res.status(404).json({ error: true, message: "User not logged in2" });
        } else if (req.user && !req.user.Error) {
            // Authentication successful
            res.status(200).json({
                error: false,
                message: "User is logged in, user object retrieved successfully",
                user: req.user,
            });
        }
});


// Logout route
router.get("/logout", (req, res) => {
    if (!req.user && req.user.Error) {
        res.status(400).json({ error: true, message: "User not logged in" });
    } else if (req.user && !req.user.Error) {
        req.logout()
        res.status(200).json({ error: false, message: "Successfully Logged Out" });
    } else {
        res.status(400).json({ error: true, message: "User not logged in" });
    }
});

const Auth = router
module.exports = Auth;