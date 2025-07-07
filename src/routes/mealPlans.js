import { Router } from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import {
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/mealPlanController.js";
const router = Router();

router.get("/", jwtAuth, listPlans);
router.post("/", jwtAuth, createPlan);
router.get("/:id", jwtAuth, getPlan);
router.put("/:id", jwtAuth, updatePlan);
router.delete("/:id", jwtAuth, deletePlan);

export default router;
