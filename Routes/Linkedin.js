const express = require('express');
const router = express.Router();
var passport = require('passport');


// OAuth with LinkedIn
router.get('/linkedin', passport.authenticate('linkedin', {
    scope: ['email', 'profile','openid'],
    state: true,
}));

// callback route for linkedin to redirect to
router.get('/linkedin/redirect', passport.authenticate('linkedin', {
    successRedirect: process.env.SUCCSESS_URL,
    failureRedirect: process.env.FAILURE_URL,
}));



const linkedinRouter = router
module.exports = linkedinRouter;
