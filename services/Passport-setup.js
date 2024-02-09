const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const prisma = require("../lib/prisma");
const { findUserByEmail } = require("../lib/Operations");

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email', // Assuming email is your username field
    passwordField: 'password' // Assuming password is your password field
}, async (username, password, done) => {
    const user = await findUserByEmail(username);
    const error = [
        { Error: 'Invalid email or password' },
        { Error: 'This Email is Linked to an account created by Either Google or Linkedin' },
        { Error: 'User does not exist' }
    ];
    switch (true) {
        case !user:
            return done(null, error[2]);
        case user && (user.google_id || user.linkedin_id && !user.password):
            return done(null, error[1]);
        case user && user.password !== password:
            return done(null, error[0]);
        default:
            return done(null, user)
    }

}));



// Google Strategy
passport.use(new GoogleStrategy({
    clientID: '1016676173923-h145m6o24almrsigsd3qpirac371ev84.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/redirect',
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails, photos } = profile;
    const email = emails[0].value;
    const photo = photos[0].value;
    const error = [
        { Error: 'User does not exist' },
        { Error: 'This email is linked to an account created by Linkedin' }
    ];

    try {
        const user = await findUserByEmail(email);
        if (user) {
            if (user.google_id === null && user.linkedin_id !== null) {
                return done(null, error[1]);
            }
            return done(null, user);
        } else {
            console.log('User does not exist');
            const newUser = await prisma.user.create({
                data: {
                    fullname: displayName,
                    email,
                    avatar: photo,
                    google_id: id
                }
            });
            console.log(newUser);
            return done(null, newUser);
        }
    } catch (error) {
        return { error: error.message, done: done(null, false) };
    }
}));


// LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: '78imgdl3ttm8mp',
    clientSecret: 'lownFkB9s6JngSwA',
    callbackURL: 'http://localhost:3000/auth/linkedin/redirect',
    scope: ['email', 'profile', 'openid'],
    state: true,
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, email, picture } = profile;
    try {
        const user = await findUserByEmail(email);
        if (user) {
            console.log('User exists');
            return done(null, user);
        } else {
            console.log('User does not exist');
            const newUser = await prisma.user.create({
                data: {
                    fullname: displayName,
                    email,
                    avatar: picture,
                    linkedin_id: id
                }
            }).catch((error) => {
                console.log(error);
            });
            console.log(newUser);
            return done(null, newUser);
        }
    } catch (error) {
        return { error: error.message, done: done(null, false) };
    }
}));


// serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
