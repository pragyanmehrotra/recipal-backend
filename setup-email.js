#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEmail() {
  console.log("📧 ReciPal Email Setup\n");
  console.log(
    "This will help you configure real email sending for your app.\n"
  );

  // Check if .env exists
  const envPath = path.join(__dirname, ".env");
  const envExists = fs.existsSync(envPath);

  let envContent = "";
  if (envExists) {
    envContent = fs.readFileSync(envPath, "utf8");
    console.log("✅ Found existing .env file");
  } else {
    console.log("📝 Creating new .env file...");
  }

  // Ask for email provider
  console.log("\nChoose your email provider:");
  console.log("1. Gmail (Recommended for development)");
  console.log("2. SendGrid (Recommended for production)");
  console.log("3. Mailgun");
  console.log("4. Resend");
  console.log("5. Custom SMTP");

  const providerChoice = await question("\nEnter your choice (1-5): ");

  let smtpConfig = {};

  switch (providerChoice) {
    case "1": // Gmail
      console.log("\n📧 Gmail Setup");
      console.log("1. Enable 2-Factor Authentication on your Gmail account");
      console.log("2. Go to Google Account Settings → Security");
      console.log('3. Under "2-Step Verification" → "App passwords"');
      console.log('4. Generate a new app password for "Mail"\n');

      smtpConfig = {
        host: "smtp.gmail.com",
        port: "587",
        secure: "false",
      };

      smtpConfig.user = await question("Enter your Gmail address: ");
      smtpConfig.pass = await question(
        "Enter your 16-character app password: "
      );
      smtpConfig.from = smtpConfig.user;
      break;

    case "2": // SendGrid
      console.log("\n📧 SendGrid Setup");
      console.log("1. Sign up at sendgrid.com");
      console.log("2. Verify your domain or use single sender verification");
      console.log("3. Go to Settings → API Keys");
      console.log('4. Create a new API key with "Mail Send" permissions\n');

      smtpConfig = {
        host: "smtp.sendgrid.net",
        port: "587",
        secure: "false",
        user: "apikey",
      };

      smtpConfig.pass = await question("Enter your SendGrid API key: ");
      smtpConfig.from = await question("Enter your verified email address: ");
      break;

    case "3": // Mailgun
      console.log("\n📧 Mailgun Setup");
      console.log("1. Sign up at mailgun.com");
      console.log("2. Add your domain or use sandbox domain");
      console.log("3. Get SMTP credentials from the dashboard\n");

      smtpConfig.host = "smtp.mailgun.org";
      smtpConfig.port = "587";
      smtpConfig.secure = "false";
      smtpConfig.user = await question("Enter your Mailgun SMTP username: ");
      smtpConfig.pass = await question("Enter your Mailgun SMTP password: ");
      smtpConfig.from = await question("Enter your from email address: ");
      break;

    case "4": // Resend
      console.log("\n📧 Resend Setup");
      console.log("1. Sign up at resend.com");
      console.log("2. Verify your domain or use test domain");
      console.log("3. Get SMTP credentials from the dashboard\n");

      smtpConfig = {
        host: "smtp.resend.com",
        port: "587",
        secure: "false",
        user: "resend",
      };

      smtpConfig.pass = await question("Enter your Resend API key: ");
      smtpConfig.from = await question("Enter your verified email address: ");
      break;

    case "5": // Custom SMTP
      console.log("\n📧 Custom SMTP Setup");
      smtpConfig.host = await question("Enter SMTP host: ");
      smtpConfig.port =
        (await question("Enter SMTP port (default 587): ")) || "587";
      smtpConfig.secure =
        (await question("Use SSL/TLS? (y/n, default n): ").toLowerCase()) ===
        "y"
          ? "true"
          : "false";
      smtpConfig.user = await question("Enter SMTP username: ");
      smtpConfig.pass = await question("Enter SMTP password: ");
      smtpConfig.from = await question("Enter from email address: ");
      break;

    default:
      console.log("❌ Invalid choice. Exiting...");
      rl.close();
      return;
  }

  // Build environment variables
  const emailVars = [
    `# Email Configuration`,
    `SMTP_HOST=${smtpConfig.host}`,
    `SMTP_PORT=${smtpConfig.port}`,
    `SMTP_USER=${smtpConfig.user}`,
    `SMTP_PASS=${smtpConfig.pass}`,
    `SMTP_FROM=${smtpConfig.from}`,
    `SMTP_SECURE=${smtpConfig.secure}`,
    ``,
  ].join("\n");

  // Add other required variables if they don't exist
  const requiredVars = [
    "DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres",
    "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production",
    "NODE_ENV=development",
  ];

  let newEnvContent = emailVars;

  // Add existing variables that aren't email-related
  if (envExists) {
    const lines = envContent.split("\n");
    const nonEmailLines = lines.filter(
      (line) =>
        !line.startsWith("SMTP_") &&
        !line.startsWith("# Email") &&
        line.trim() !== ""
    );
    if (nonEmailLines.length > 0) {
      newEnvContent += nonEmailLines.join("\n") + "\n";
    }
  }

  // Add required variables if they don't exist
  requiredVars.forEach((varLine) => {
    const varName = varLine.split("=")[0];
    if (!newEnvContent.includes(varName + "=")) {
      newEnvContent += varLine + "\n";
    }
  });

  // Write to .env file
  fs.writeFileSync(envPath, newEnvContent);

  console.log("\n✅ Email configuration saved to .env file!");
  console.log("\n📋 Next steps:");
  console.log("1. Test your configuration: npm start");
  console.log("2. Try registering a new user");
  console.log("3. Check your email for the verification code");
  console.log(
    "\n🔒 Security reminder: Never commit your .env file to version control!"
  );

  rl.close();
}

setupEmail().catch(console.error);
