import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.resolve(__dirname, "../../recipeitems-latest.json");
const outputPath = path.resolve(__dirname, "../../latest-recipes.json");

function convertToNdjson() {
  const arr = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const out = fs.createWriteStream(outputPath);
  let count = 0;
  arr.forEach((obj) => {
    try {
      out.write(JSON.stringify(obj) + "\n");
      count++;
    } catch (e) {
      // skip
    }
  });
  out.end();
  console.log(`Wrote ${count} recipes to ${outputPath}`);
}

convertToNdjson();
