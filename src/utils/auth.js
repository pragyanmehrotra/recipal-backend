// Get Clerk user ID from request (after ClerkExpressRequireAuth)
export function getClerkUserId(req) {
  return req.auth?.userId;
}
