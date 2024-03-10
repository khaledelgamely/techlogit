import { Router } from "express";
import * as controller from "./messages.controller.js";
import * as validator from "./messages.validation.js";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth, { checkSameUser } from "../../middleware/auth.js";

const router = Router();
router
  .route("/:userId/:convId")
  .get(
    auth("user"),
    checkSameUser(),
    validation(validator.getConvoMessages),
    controller.getConvoMessages
  );
router
  .route("/dashboard/chat/:convId")
  .get(
    auth("admin"),
    validation(validator.getAdminConvoMessages),
    controller.getConvoMessages
  );
router
  .route("/:userId")
  .post(
    auth("user"),
    checkSameUser(),
    fileUpload("messages", fileValidation.messages).fields([{ name: "image" }]),
    validation(validator.addNewMessage),
    controller.addNewMessage
  );
router
  .route("/admin/dashboard")
  .post(
    auth("admin", "tech"),
    fileUpload("messages", fileValidation.messages).fields([{ name: "image" }]),
    validation(validator.adminAddNewMessage),
    controller.adminAddNewMessage
  );
router
  .route("/:userId/getFiles/:convId")
  .get(
    auth("user"),
    checkSameUser(),
    validation(validator.getFiles),
    controller.getFiles
  );
router
  .route("/:convId/getFiles/admin/dashboard")
  .get(
    auth("admin", "tech"),
    validation(validator.getAdminFiles),
    controller.getFiles
  );
export default router;
