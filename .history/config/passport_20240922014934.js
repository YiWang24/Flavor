if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //Load environment variables from .env in development
}
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACKURL = process.env.GOOGLE_CALLBACKURL;
// Initialize Local Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Initialize Google Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACKURL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Profile ID:", profile.id); // Check the type and value
        console.log("Profile displayName:", profile.displayName); // Check if ema
        console.log("Profile Emails:", profile.emails[0].value);
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          }).save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Middleware for Google authentication
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only the user ID in the session
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Fetch user by ID
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = {passport,googleLogin};
