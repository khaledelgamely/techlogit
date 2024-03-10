import google from "passport-google-oauth2";
import { UserModel } from "../user/user.model.js";
import dotenv from "dotenv";
import { customAlphabet } from "nanoid";
import { sendGrid } from "../../utils/sendGrid.js";

import {
  generateToken,
  verifyToken,
} from "../../utils/GenerateAndVerifyToken.js";
dotenv.config();
const GoogleStrategy = google.Strategy;

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `https://techlogit.com/api/auth/google/callback`,

    // profileFields: ["id", "displayName", "photos", "email"],
    passReqToCallback: true,
  },
  async function (request, accessToken, refreshToken, profile, done) {
    const verficationCode = customAlphabet(
      process.env.CUSTOM_PASSWORD,
      Number.parseInt(process.env.CUSTOM_PASSWORD_LENGTH)
    )();
    try {
      //WELCOME_USER_TEMPLATE_ID
      let user = await UserModel.findOne({ email: profile.email });
      if (!user) {
        user = await UserModel.create({
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile?.family_name||"",
          profilePic: profile.picture,
          password: verficationCode,
          googleId: profile.id,
          confirmEmail: true,
        });
        await sendGrid({
          to: user.email,
          from: process.env.AUTH_SENDER_EMAIL,
          templateId: process.env.WELCOME_USER_TEMPLATE_ID,
          subject: "wellcome new user",
          data: { user: user.firstName },
        });
      }

      user = user.toObject();
      const token = generateToken({
        payload: { email: user.email, role: user.role, id: user._id },
        expiresIn: 60 * 60,
      });
      const refToken = generateToken({
        payload: { email: user.email, role: user.role, id: user._id },
        expiresIn: 60 * 60 * 24 * 365,
      });
      user.accessToken = token;
      user.refreshToken = refToken;
      //   console.log("profile", profile);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }

    // UserModel.findOrC,reate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }
);
