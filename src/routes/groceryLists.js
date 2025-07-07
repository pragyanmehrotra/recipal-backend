import { Router } from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import {
  listLists,
  getList,
  createList,
  updateList,
  deleteList,
} from "../controllers/groceryListController.js";
const router = Router();

router.get("/", jwtAuth, listLists);
router.post("/", jwtAuth, createList);
router.get("/:id", jwtAuth, getList);
router.put("/:id", jwtAuth, updateList);
router.delete("/:id", jwtAuth, deleteList);

export default router;
