import { Router } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  listLists,
  getList,
  createList,
  updateList,
  deleteList,
} from "../controllers/groceryListController.js";
const router = Router();

router.get("/", ClerkExpressRequireAuth(), listLists);
router.post("/", ClerkExpressRequireAuth(), createList);
router.get("/:id", ClerkExpressRequireAuth(), getList);
router.put("/:id", ClerkExpressRequireAuth(), updateList);
router.delete("/:id", ClerkExpressRequireAuth(), deleteList);

export default router;
