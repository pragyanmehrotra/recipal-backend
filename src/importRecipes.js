import readline from "readline";
import { db } from "./db/index.js";
import { recipes } from "./db/schema.js";
import fetch from "node-fetch";
import cliProgress from "cli-progress";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const recipeFilePath = path.resolve(__dirname, "../recipeitems-latest.json");

function loadRecipesArray(filePath) {
  let arr = [];
  let skipped = 0;
  try {
    // Try to parse the whole file as a JSON array
    arr = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`Loaded ${arr.length} recipes from array.`);
    return arr;
  } catch (e) {
    console.warn(
      "Failed to parse as JSON array, falling back to line-by-line parsing:",
      e.message
    );
    // Fallback: try to parse line by line (for partially corrupted files)
    const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        arr.push(JSON.parse(line));
      } catch (err) {
        skipped++;
      }
    }
    console.log(
      `Loaded ${arr.length} recipes from lines, skipped ${skipped} malformed lines.`
    );
    return arr;
  }
}

function isValidUrl(url) {
  return typeof url === "string" && /^https?:\/\//.test(url);
}

function isValidCookTime(recipe) {
  const cookTime =
    recipe.cookTime ||
    recipe.totalTime ||
    recipe.cook_time ||
    recipe.data?.cookTime;
  return (
    typeof cookTime === "string" &&
    cookTime.trim() !== "" &&
    cookTime !== "null"
  );
}

function isValidImageUrl(image) {
  return typeof image === "string" && /^https?:\/\//.test(image);
}

function extractServings(servingsField) {
  if (!servingsField || typeof servingsField !== "string") return null;
  // Match the first integer or range (e.g., '4', '4-8', '4 to 8')
  const match = servingsField.match(/\d+/);
  if (match) return parseInt(match[0], 10);
  return null;
}

function hasValidServings(recipe) {
  const rawServings =
    recipe.servings ||
    recipe.recipeYield ||
    recipe.recipe_yield ||
    recipe.data?.recipeYield;
  const servings = extractServings(rawServings);
  if (!servings) {
    return false;
  }
  return true;
}

async function isReachable(url, timeoutMs = 3000) {
  if (typeof url !== "string" || !/^https?:\/\//.test(url)) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function validateRecipe(recipe) {
  // Only validate that URL is valid and reachable within 3s
  const url = recipe.url;
  if (!(await isReachable(url, 3000))) {
    return { valid: false, reason: "Recipe URL not reachable" };
  }
  // Image check can remain as is
  const image = recipe.image;
  if (!(await isReachable(image, 3000))) {
    return { valid: false, reason: "Image URL not reachable" };
  }
  return { valid: true };
}

async function importRecipes() {
  const recipeData = loadRecipesArray(recipeFilePath);
  const fileStream = fs.createReadStream("recipeitems-latest.json");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let count = 0;
  let inserted = 0;
  const batchSize = 10;
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  // After loading recipes, before starting the progress bar:
  // console.log("Loaded recipes:", recipeData.length); // This line is now redundant as recipeData is loaded globally
  // if (recipeData.length > 0) {
  //   console.log("First recipe:", recipeData[0]);
  //   if (recipeData.length > 1) console.log("Second recipe:", recipeData[1]);
  // }
  bar.start(recipeData.length, 0);
  let imported = 0;
  for (let i = 0; i < recipeData.length; i += batchSize) {
    const batch = recipeData.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(validateRecipe));
    for (let j = 0; j < batch.length; j++) {
      const recipe = batch[j];
      const result = results[j];
      if (!result.valid) {
        console.log(`SKIP: ${result.reason}`, recipe.name || recipe.data?.name);
        continue;
      }
      // Map fields
      const rawServings =
        recipe.servings ||
        recipe.recipeYield ||
        recipe.recipe_yield ||
        recipe.data?.recipeYield;
      let servings = extractServings(rawServings);
      if (!servings) servings = 4;
      let cookTime =
        recipe.cookTime ||
        recipe.totalTime ||
        recipe.cook_time ||
        recipe.data?.cookTime;
      if (!cookTime || cookTime === "null" || cookTime === "")
        cookTime = "45 min";
      const row = {
        name: recipe.name,
        ingredients: recipe.ingredients,
        url: recipe.url,
        image: recipe.image,
        cook_time: cookTime,
        source: recipe.source,
        recipe_yield: servings,
        date_published: recipe.datePublished,
        prep_time: recipe.prepTime,
        description: recipe.description,
        data: recipe,
      };
      try {
        // Insert, skip duplicates (name+url)
        await db.insert(recipes).values(row).onConflictDoNothing();
        inserted++;
      } catch (e) {
        // Log error but continue
        console.error("Error inserting recipe:", row.name, e.message);
      }
      imported++;
    }
    bar.update(Math.min(i + batchSize, recipeData.length));
  }
  bar.stop();
  console.log(`Imported ${imported} recipes.`);
}

// If this is a script, run importRecipes()
if (import.meta.url === `file://${process.argv[1]}`) {
  importRecipes().catch(console.error);
}

// To use this script, make sure to install cli-progress:
// npm install cli-progress
