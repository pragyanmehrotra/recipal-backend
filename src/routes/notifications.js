import { Router } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  registerToken,
  sendNotification,
} from "../controllers/notificationController.js";
const router = Router();

router.post("/register", ClerkExpressRequireAuth(), registerToken);
router.post("/send", ClerkExpressRequireAuth(), sendNotification);

export default router;
