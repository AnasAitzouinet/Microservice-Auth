const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

jest.mock('passport');
jest.mock('passport-google-oauth20');
jest.mock('passport-linkedin-oauth2');

describe('Passport Setup', () => {
  it('should serialize and deserialize user', () => {
    const user = { id: 1, name: 'John Doe' };
    const done = jest.fn();

    passport.serializeUser.mockImplementation((user, done) => {
      done(null, user);
    });
    passport.deserializeUser.mockImplementation((user, done) => {
      done(null, user);
    });

    passport.serializeUser(user, done);
    passport.deserializeUser(user, done);

    expect(done).toHaveBeenCalledTimes(2);
    expect(done).toHaveBeenCalledWith(null, user);
  });
});
  