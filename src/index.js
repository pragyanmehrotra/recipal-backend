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
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import recommendationsRoutes from "./routes/recommendations.js"; // New import added

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
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/recommendations", recommendationsRoutes); // New route added

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
  // Get the error code from either the main error or its cause
  const code = err.code || err.cause?.code;
  const detail = err.detail || err.cause?.detail;
  const column = err.column || err.cause?.column;

  // Handle database unique constraint violations
  if (code === "23505") {
    const field = detail?.match(/Key \((.+)\)=/)?.[1] || "field";

    // Log duplicate email attempts as info instead of error
    if (field === "email") {
      console.log(
        `Info: User attempted to register with existing email: ${
          detail?.match(/=\((.+)\)/)?.[1] || "unknown"
        }`
      );
    } else {
      console.error("Error:", err);
    }

    return res.status(400).json({
      error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Log all other errors as errors
  console.error("Error:", err);

  // Handle database foreign key violations
  if (code === "23503") {
    return res.status(400).json({
      error: "Referenced record does not exist",
    });
  }

  // Handle database not null violations
  if (code === "23502") {
    const field = column || "field";
    return res.status(400).json({
      error: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  // Default error response
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 4000;
if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
