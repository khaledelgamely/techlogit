import { Router } from "express";
import * as controller from "./statistics.controller.js";
import auth from "../../middleware/auth.js";
// import * as validator from "./orders.validation.js";
import { validation } from "../../middleware/validation.js";

const router = Router();

router.get("/users", auth("admin"), controller.getUserInfo);
router.get("/services", auth("admin"), controller.getServicesInfo);
router.get("/orders", auth("admin"), controller.getOrderInfo);

export default router;
