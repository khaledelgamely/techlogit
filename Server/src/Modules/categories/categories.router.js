import { Router } from "express";
import * as controller from "./categories.controller.js";
import * as validator from "./categories.validation.js";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from "../../middleware/auth.js";

const router = Router();
router
  .route("/")
  .get(controller.getAllCategories)
  .post(
    auth("admin", "tech"),
    fileUpload("categories", fileValidation.image).fields([
      { name: "image" },
      { name: "icon" },
    ]),
    validation(validator.addCategory),
    controller.addCategory
  );

router
  .route("/:id")
  .patch(
    auth("admin", "tech"),
    fileUpload("categories", fileValidation.image).fields([
      { name: "image" },
      { name: "icon" },
    ]),
    validation(validator.updateCategory),
    controller.updateCategory
  )
  .delete(
    auth("admin", "tech"),
    validation(validator.deleteCategory),
    controller.deleteCategory
  );
export default router;
