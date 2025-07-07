import {
  registerPushToken,
  getPushTokens,
} from "../services/notificationService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// POST /api/notifications/register
export const registerToken = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { expo_token } = req.body;
  if (!expo_token)
    return res.status(400).json({ error: "expo_token required" });
  const result = await registerPushToken(userId, expo_token);
  res.status(201).json(result);
});

// POST /api/notifications/send
export const sendNotification = asyncHandler(async (req, res) => {
  // TODO: Integrate with Expo push notification service once frontend is ready and provides valid Expo push tokens.
  // See: https://docs.expo.dev/push-notifications/push-notifications-setup/
  // For now, this is a safe placeholder that does not break the backend.
  res.json({
    message:
      "Notification sending is not yet implemented. TODO: Integrate Expo push notification service when frontend is ready.",
  });
});
