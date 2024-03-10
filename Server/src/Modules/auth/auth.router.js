// import express from "express";
// import { register, login } from "./auth.controller.js";
// import * as validators from "../../Middlewares/Validations/authValidation.js";
// import { validation } from "../../Middlewares/validation.js";
// let router = express.Router();
// router.post("/register", validation(validators.register), register);
// // router.post("/login", validation(validators.login), login);
// router.post("/login", login);
// export default router;

import { Router, response } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as authController from "./auth.controller.js";
import * as authValidator from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import passport from "passport";
import { catchError } from "../../utils/catchAsyncError.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
const router = Router();

router.post(
  "/signup",
  fileUpload("profilePic", fileValidation.image).single("image"),
  validation(authValidator.signUpSchema),
  authController.signUp
);
router.get(
  "/confirmEmail/:token",
  validation(authValidator.tokenSchema),
  authController.confirmEmail
);
router.get(
  "/newConfirmEmail/:token",
  validation(authValidator.tokenSchema),
  authController.requestNewConfirmEmail
);

router.post(
  "/signin",
  validation(authValidator.signInSchema),
  authController.signIn
);

router.post(
  "/sendcode",
  validation(authValidator.sendVerificationCodeSchema),
  authController.sendVerificationCode
);

router.post(
  "/forgetpassword",
  validation(authValidator.forgetPasswordSchema),
  authController.forgetPassword
);

router.patch(
  "/changepassword",
  auth("user", "admin"),
  validation(authValidator.changePasswordSchema),
  authController.changePassword
);
export default router;

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/failed/facebook",
    session: false,
  }),
  authController.loginWithProvider
);
router.get("/failed/facebook", authController.loginWithProviderFailed);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    session: false,
    // successRedirect: "/",
    failureRedirect: "/auth/failed/google",
  }),
  authController.loginWithProvider
);
router.get("/failed/google", authController.loginWithProviderFailed);
