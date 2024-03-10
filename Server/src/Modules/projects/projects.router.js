import { Router } from "express";
import * as controller from "./projects.controller.js";
import * as validator from "./projects.validation.js";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from "../../middleware/auth.js";

const router = Router();
router
  .route("/")
  .get(
    // get all services from all categories
    controller.getAllProjects
  )
  .post(
    // add new project
    auth("admin", "tech"),
    fileUpload("projects", fileValidation.image).fields([
      { name: "smallImage" },
      { name: "largeImage" },
    ]),
    validation(validator.addProject),
    controller.addProject
  );
router
  .route("/:projectId")
  .get(validation(validator.getSingleProject), controller.getSingleProject)
  .patch(
    auth("admin", "tech"),
    // add new project
    fileUpload("projects", fileValidation.image).fields([
      { name: "smallImage" },
      { name: "largeImage" },
    ]),
    validation(validator.updateProject),
    controller.updateProject
  )
  .delete(
    auth("admin", "tech"),
    validation(validator.deleteProject),
    controller.deleteProject
  );
router
  .route("/category/:categoryId")
  .get(
    validation(validator.getcategoryProjects),
    controller.getcategoryProjects
  );
export default router;
