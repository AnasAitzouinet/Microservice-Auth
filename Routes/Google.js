const express = require('express');
const router = express.Router();
const passport = require('passport');



// OAuth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google', {
    successRedirect: 'http://localhost:3001/Profile',
    failureRedirect: "http://localhost:3000/login/failed",
    }));


// Export the router
const googleRouter = router
module.exports = googleRouter;
