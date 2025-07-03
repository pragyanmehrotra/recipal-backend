import {
  findUserByClerkId,
  createUser,
  updateUserProfile,
} from "../services/userService.js";
import { getClerkUserId } from "../utils/auth.js";

// GET /api/user/profile
export async function getProfile(req, res, next) {
  try {
    const clerkId = getClerkUserId(req);
    let user = await findUserByClerkId(clerkId);
    if (!user) {
      // Optionally auto-create user on first login
      user = await createUser({
        clerk_id: clerkId,
        email: req.auth?.sessionClaims?.email_address,
        name: req.auth?.sessionClaims?.name,
      });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// PUT /api/user/profile
export async function putProfile(req, res, next) {
  try {
    const clerkId = getClerkUserId(req);
    const { name } = req.body;
    const user = await updateUserProfile(clerkId, { name });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
