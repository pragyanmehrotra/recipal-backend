import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/user.js";
import mealPlansRoutes from "./routes/mealPlans.js";
import groceryListsRoutes from "./routes/groceryLists.js";
import notificationsRoutes from "./routes/notifications.js";
import paymentsRoutes from "./routes/payments.js";
import externalRecipesRoutes from "./routes/externalRecipes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api/user", userRoutes);
app.use("/api/meal-plans", mealPlansRoutes);
app.use("/api/grocery-lists", groceryListsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/external/recipes", externalRecipesRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "ReciPal backend is running!" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
