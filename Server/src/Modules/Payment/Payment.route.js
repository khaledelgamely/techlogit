import { Router } from "express";
import createPayment from "./Payment.controller.js";

const router = Router();
router.route("/").post(createPayment);

export default router;












