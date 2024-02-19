const express = require('express');
const router = express.Router();
const passport = require('passport');



// OAuth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'),
    (req, res) => {
        if(req.user.Error) {
            res.redirect(proces.env.FAILURE_URL, 401, { error: true, message: req.user.Error })
        } else if(req.user && !req.user.Error) {
            // Authentication successful
            res.redirect(process.env.SUCCSESS_URL)
        }
    });


// Export the router
const googleRouter = router
module.exports = googleRouter;
