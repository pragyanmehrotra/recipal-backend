import nodemailer from "nodemailer";

// Create transporter based on environment and configuration
const createTransporter = async () => {
  // Check if we have SMTP credentials configured
  const hasSmtpConfig =
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!hasSmtpConfig) {
    // Fallback to test account for development
    if (process.env.NODE_ENV === "development") {
      console.log("⚠️  No SMTP configuration found. Using test email account.");
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      throw new Error("SMTP configuration required for production");
    }
  }

  // Production SMTP configuration
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // Add TLS options for better security
  if (process.env.SMTP_SECURE === "true") {
    config.secure = true;
  } else {
    config.secure = false;
    config.requireTLS = true;
    config.rejectUnauthorized = false; // Only for development
  }

  return nodemailer.createTransport(config);
};

// Generate verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from:
        process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@recipal.com",
      to: email,
      subject: "Verify your ReciPal account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to ReciPal!</h1>
          </div>
          <div style="padding: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for signing up! Please verify your email address by entering the following code in the app:
            </p>
            <div style="background-color: #f8f9fa; padding: 25px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #FF6B6B;">
              <h2 style="color: #FF6B6B; font-size: 36px; letter-spacing: 6px; margin: 0; font-weight: bold; font-family: 'Courier New', monospace;">${verificationCode}</h2>
            </div>
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              ⏰ This code will expire in 1 hour.
            </p>
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                🔒 If you didn't create this account, you can safely ignore this email.
              </p>
            </div>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              This is an automated message from ReciPal. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "development" && !process.env.SMTP_HOST) {
      console.log(
        "📧 Test email sent! Preview URL: %s",
        nodemailer.getTestMessageUrl(info)
      );
    } else {
      console.log("📧 Verification email sent to:", email);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw new Error("Failed to send verification email");
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetCode) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from:
        process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@recipal.com",
      to: email,
      subject: "Reset your ReciPal password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Password Reset Code</h1>
          </div>
          <div style="padding: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              You requested to reset your password. Enter the following code in the app to continue:
            </p>
            <div style="background-color: #f8f9fa; padding: 25px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #FF6B6B;">
              <h2 style="color: #FF6B6B; font-size: 36px; letter-spacing: 6px; margin: 0; font-weight: bold; font-family: 'Courier New', monospace;">${resetCode}</h2>
            </div>
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              ⏰ This code will expire in 15 minutes.
            </p>
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                🔒 If you didn't request this password reset, you can safely ignore this email.
              </p>
            </div>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              This is an automated message from ReciPal. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "development" && !process.env.SMTP_HOST) {
      console.log(
        "📧 Test email sent! Preview URL: %s",
        nodemailer.getTestMessageUrl(info)
      );
    } else {
      console.log("📧 Password reset email sent to:", email);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw new Error("Failed to send password reset email");
  }
};
