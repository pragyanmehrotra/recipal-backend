import {
  listGroceryLists,
  getGroceryListById,
  createGroceryList,
  updateGroceryList,
  deleteGroceryList,
} from "../services/groceryListService.js";
import { getClerkUserId } from "../utils/auth.js";
import { findUserByClerkId } from "../services/userService.js";

async function getDbUserId(req) {
  const clerkId = getClerkUserId(req);
  const user = await findUserByClerkId(clerkId);
  return user?.id;
}

export async function listLists(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const lists = await listGroceryLists(userId);
    res.json({ lists });
  } catch (err) {
    next(err);
  }
}

export async function getList(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const list = await getGroceryListById(userId, Number(req.params.id));
    if (!list) return res.status(404).json({ error: "Grocery list not found" });
    res.json({ list });
  } catch (err) {
    next(err);
  }
}

export async function createList(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const { items, generated_from } = req.body;
    const list = await createGroceryList(userId, { items, generated_from });
    res.status(201).json({ list });
  } catch (err) {
    next(err);
  }
}

export async function updateList(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const list = await updateGroceryList(
      userId,
      Number(req.params.id),
      req.body
    );
    if (!list) return res.status(404).json({ error: "Grocery list not found" });
    res.json({ list });
  } catch (err) {
    next(err);
  }
}

export async function deleteList(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const list = await deleteGroceryList(userId, Number(req.params.id));
    if (!list) return res.status(404).json({ error: "Grocery list not found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
