# 📧 Email Setup Guide for ReciPal

This guide shows you how to set up real email sending for your ReciPal app using the latest and most reliable email providers.

## 🚀 Quick Setup Options

### Option 1: Gmail (Recommended for Development)

**Best for:** Development, testing, small projects
**Cost:** Free (up to 500 emails/day)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account Settings → Security
   - Under "2-Step Verification" → "App passwords"
   - Generate a new app password for "Mail"
3. **Add to your `.env` file:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM=your-email@gmail.com
   SMTP_SECURE=false
   ```

### Option 2: SendGrid (Recommended for Production)

**Best for:** Production apps, high volume
**Cost:** Free tier (100 emails/day), then $14.95/month

1. **Sign up** at [sendgrid.com](https://sendgrid.com)
2. **Verify your domain** or use single sender verification
3. **Create API Key:**
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
4. **Add to your `.env` file:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM=your-verified-email@yourdomain.com
   SMTP_SECURE=false
   ```

### Option 3: Mailgun (Great Alternative)

**Best for:** Production apps, developers
**Cost:** Free tier (5,000 emails/month for 3 months)

1. **Sign up** at [mailgun.com](https://mailgun.com)
2. **Add your domain** or use sandbox domain
3. **Get SMTP credentials** from the dashboard
4. **Add to your `.env` file:**
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=postmaster@your-domain.mailgun.org
   SMTP_PASS=your-mailgun-password
   SMTP_FROM=noreply@yourdomain.com
   SMTP_SECURE=false
   ```

### Option 4: Resend (Modern Alternative)

**Best for:** Modern apps, great developer experience
**Cost:** Free tier (3,000 emails/month)

1. **Sign up** at [resend.com](https://resend.com)
2. **Verify your domain** or use test domain
3. **Get SMTP credentials** from the dashboard
4. **Add to your `.env` file:**
   ```env
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASS=your-resend-api-key
   SMTP_FROM=onboarding@resend.dev
   SMTP_SECURE=false
   ```

## 🔧 Environment Variables Reference

Create a `.env` file in your `backend` directory with these variables:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_SECURE=false

# Other required variables
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## 📋 Step-by-Step Setup

### 1. Create Environment File

```bash
cd backend
touch .env
```

### 2. Choose Your Provider

Pick one of the options above and follow their specific setup instructions.

### 3. Test Your Configuration

```bash
# Start your backend server
npm start

# Try registering a new user
# Check the console for email sending logs
```

### 4. Verify Email Delivery

- Check your email inbox (and spam folder)
- Look for the verification code
- Enter it in the app

## 🛠 Troubleshooting

### Common Issues:

**"Authentication failed"**

- Double-check your SMTP credentials
- For Gmail: Make sure you're using an App Password, not your regular password
- For SendGrid: Use "apikey" as the username

**"Connection timeout"**

- Check your firewall settings
- Verify the SMTP port (usually 587 or 465)
- Try different ports if one doesn't work

**"Email not received"**

- Check spam/junk folder
- Verify the "from" email address is correct
- Some providers have sending limits

### Debug Mode:

Add this to your `.env` file for detailed logging:

```env
DEBUG=nodemailer:*
```

## 🔒 Security Best Practices

1. **Never commit your `.env` file** to version control
2. **Use App Passwords** instead of regular passwords
3. **Verify your domain** with your email provider
4. **Set up SPF/DKIM records** for better deliverability
5. **Monitor your sending reputation**

## 📊 Provider Comparison

| Provider | Free Tier | Setup Difficulty | Deliverability | Best For    |
| -------- | --------- | ---------------- | -------------- | ----------- |
| Gmail    | 500/day   | Easy             | Good           | Development |
| SendGrid | 100/day   | Medium           | Excellent      | Production  |
| Mailgun  | 5K/month  | Medium           | Excellent      | Production  |
| Resend   | 3K/month  | Easy             | Excellent      | Modern apps |

## 🎯 Recommendation

- **Development:** Use Gmail (free, easy setup)
- **Production:** Use SendGrid or Resend (better deliverability, monitoring)

## 📞 Need Help?

If you're having trouble setting up email:

1. Check the console logs for specific error messages
2. Verify your SMTP credentials are correct
3. Test with a simple email client first
4. Check your email provider's documentation

The system will automatically fall back to test emails if no SMTP configuration is found, so your app will still work for development!
