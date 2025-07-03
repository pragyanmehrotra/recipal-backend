import { Router } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/mealPlanController.js";
const router = Router();

router.get("/", ClerkExpressRequireAuth(), listPlans);
router.post("/", ClerkExpressRequireAuth(), createPlan);
router.get("/:id", ClerkExpressRequireAuth(), getPlan);
router.put("/:id", ClerkExpressRequireAuth(), updatePlan);
router.delete("/:id", ClerkExpressRequireAuth(), deletePlan);

export default router;
