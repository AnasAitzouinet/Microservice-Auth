const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const prisma = require("../lib/prisma");
const { findUserByEmail } = require("../lib/Operations");
const { compare } = require('bcrypt');
require('dotenv').config();

// serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (username, password, done) => {
    const user = await findUserByEmail(username);

    if (!user) {
        return done(null, { Error: 'User does not exist' });
    }

    if (user.google_id || user.linkedin_id) {
        return done(null, { Error: 'This Email is Linked to an account created by Either Google or Linkedin' });
    }

    if (!user.password) {
        return done(null, { Error: 'Invalid email or password' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
        return done(null, { Error: 'Invalid email or password' });
    }

    return done(null, user);
}));


// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
            const user = await prisma.user.create({
                data: {
                    fullname: displayName,
                    email,
                    avatar: photo,
                    google_id: id
                }
            });
            console.log(user);
            return done(null, user);
        }
    } catch (error) {
        return { error: error.message, done: done(null, false) };
    }
}));

// LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/linkedin/redirect',
    scope: ['email', 'openid', "r_fullprofile"],
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

            return done(null, newUser);
        }
    } catch (error) {
        return { error: error.message, done: done(null, false) };
    }
}));


