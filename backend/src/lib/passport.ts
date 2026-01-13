
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import 'dotenv/config'

console.log("ClientID", process.env.GOOGLE_CLIENT_ID);
console.log("ClientSecret", process.env.GOOGLE_CLIENT_SECRET);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value,
      };
      done(null, profile);
    }
  )
);
