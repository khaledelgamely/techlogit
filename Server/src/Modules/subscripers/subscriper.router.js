import { Router } from "express";
import * as controller from "./subscriper.controller.js";
import auth from "../../middleware/auth.js";
import * as validator from "./subscriper.validation.js";
import { validation } from "../../middleware/validation.js";

const router = Router();

router.route("/").get(auth("admin"), controller.getAllSubscripers).post(
  validation(validator.addSubscriperSchema),

  controller.addNewSubscriper
);

router
  .route("/broadcast")

  .post(
    auth("admin"),
    validation(validator.broadcastSchema),

    controller.broadcastEmailToAllSubscripers
  );

router
  .route("/getintouch")

  .post(
    validation(validator.addGetInTouchSchema),

    controller.addNewGetInTouchAccount
  );

export default router;
