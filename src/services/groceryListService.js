import { db } from "../db/index.js";
import { grocery_lists } from "../db/schema.js";

// List all grocery lists for a user
export async function listGroceryLists(userId) {
  return db.select().from(grocery_lists).where({ user_id: userId });
}

// Get a single grocery list by ID (and user)
export async function getGroceryListById(userId, listId) {
  const result = await db
    .select()
    .from(grocery_lists)
    .where({ user_id: userId, id: listId });
  return result[0] || null;
}

// Create a new grocery list for a user
export async function createGroceryList(userId, { items, generated_from }) {
  const [list] = await db
    .insert(grocery_lists)
    .values({
      user_id: userId,
      items,
      generated_from,
    })
    .returning();
  return list;
}

// Update a grocery list (only if it belongs to the user)
export async function updateGroceryList(userId, listId, data) {
  const [list] = await db
    .update(grocery_lists)
    .set({
      ...data,
      items: data.items !== undefined ? data.items : undefined,
    })
    .where({ user_id: userId, id: listId })
    .returning();
  return list;
}

// Delete a grocery list (only if it belongs to the user)
export async function deleteGroceryList(userId, listId) {
  const [list] = await db
    .delete(grocery_lists)
    .where({ user_id: userId, id: listId })
    .returning();
  return list;
}
