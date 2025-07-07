import { Router } from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import {
  registerToken,
  sendNotification,
} from "../controllers/notificationController.js";
const router = Router();

router.post("/register", jwtAuth, registerToken);
router.post("/send", jwtAuth, sendNotification);

export default router;
