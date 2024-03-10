import express from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import * as userController from "./userController.js";
import * as userValidator from "./user.validation.js";

let router = express.Router();
//auth("admin")
router
  .route("/")
  .get(auth("admin"), userController.getAllUser)
  .post(
    auth("admin"),
    fileUpload("profilePic", fileValidation.image).single("image"),
    validation(userValidator.createUserSchema),
    userController.createUser
  )
  .delete(
    auth("admin"),
    validation(userValidator.deleteUsers),
    userController.deleteUsers
  );
router
  .route("/:id")
  .get(
    // auth("admin", "user"),
    validation(userValidator.findSingleUser),
    userController.getUser
  )
  .put(
    auth("admin"),
    fileUpload("profilePic", fileValidation.image).single("image"),
    validation(userValidator.updateUserSchema),
    userController.updateUser
  );
router
  .route("/:id/changePassword")
  .patch(
    auth("admin"),
    validation(userValidator.changeUserPassword),
    userController.changeUserPassword
  );
router
  .route("/:id/contactInfo")
  .patch(
    validation(userValidator.updateContactInfoSchema),
    userController.updateContactInfo
  );

router.route("/suspend").patch(auth("admin"), userController.suspendUsers);

export default router;
