import facebook from "passport-facebook";
import { UserModel } from "../user/user.model.js";
import dotenv from "dotenv";
import { customAlphabet } from "nanoid";

import {
  generateToken,
  verifyToken,
} from "../../utils/GenerateAndVerifyToken.js";
dotenv.config();

const FacebookStrategy = facebook.Strategy;

export const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://techlogit.com/api/auth/facebook/callback",
    profileFields: ["id", "displayName", "photos", "email"],
  },
  async function (accessToken, refreshToken, profile, cb) {
    // UserModel.findOrCreate({ facebookId: profile.id }, function (err, user) {
    // return cb(err, profile);
    // });

    const verficationCode = customAlphabet(
      process.env.CUSTOM_PASSWORD,
      Number.parseInt(process.env.CUSTOM_PASSWORD_LENGTH)
    )();
    try {
      let user = await UserModel.findOne({
        email: profile.emails[0]?.value,
      });
      if (!user) {
        user = await UserModel.create({
          email: profile.emails[0]?.value,
          firstName: profile.displayName,
          lastName: profile.name.family_name,
          profilePic: profile.photos[0].value,
          password: verficationCode,
          facebookId: profile.id,
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
      return cb(null, user);
    } catch (err) {
      return cb(err, null);
    }

    // UserModel.findOrC,reate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }
);
