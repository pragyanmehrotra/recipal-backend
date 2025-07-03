import {
  registerPushToken,
  getPushTokens,
} from "../services/notificationService.js";
import { getClerkUserId } from "../utils/auth.js";
import { findUserByClerkId } from "../services/userService.js";

async function getDbUserId(req) {
  const clerkId = getClerkUserId(req);
  const user = await findUserByClerkId(clerkId);
  return user?.id;
}

// POST /api/notifications/register
export async function registerToken(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const { expo_token } = req.body;
    if (!expo_token)
      return res.status(400).json({ error: "expo_token required" });
    const result = await registerPushToken(userId, expo_token);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/notifications/send
export async function sendNotification(req, res, next) {
  try {
    // TODO: Integrate with Expo push notification service once frontend is ready and provides valid Expo push tokens.
    // See: https://docs.expo.dev/push-notifications/push-notifications-setup/
    // For now, this is a safe placeholder that does not break the backend.
    res.json({
      message:
        "Notification sending is not yet implemented. TODO: Integrate Expo push notification service when frontend is ready.",
    });
  } catch (err) {
    next(err);
  }
}
