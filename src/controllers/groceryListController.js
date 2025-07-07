import {
  listGroceryLists,
  getGroceryListById,
  createGroceryList,
  updateGroceryList,
  deleteGroceryList,
} from "../services/groceryListService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const listLists = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const lists = await listGroceryLists(userId);
  res.json({ lists });
});

export const getList = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const list = await getGroceryListById(userId, Number(req.params.id));
  if (!list) return res.status(404).json({ error: "Grocery list not found" });
  res.json({ list });
});

export const createList = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { items, generated_from } = req.body;
  const list = await createGroceryList(userId, { items, generated_from });
  res.status(201).json({ list });
});

export const updateList = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const list = await updateGroceryList(userId, Number(req.params.id), req.body);
  if (!list) return res.status(404).json({ error: "Grocery list not found" });
  res.json({ list });
});

export const deleteList = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const list = await deleteGroceryList(userId, Number(req.params.id));
  if (!list) return res.status(404).json({ error: "Grocery list not found" });
  res.json({ success: true });
});
