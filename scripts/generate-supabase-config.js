#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

class SupabaseEmailConfig {
  constructor() {
    this.envPath = path.join(process.cwd(), ".env.local")
  }

  async run() {
    console.log("🔧 Supabase Email Configuration Generator\n")

    const envVars = this.readEnvFile()
    const provider = this.detectProvider(envVars)

    if (!provider) {
      console.log("❌ No email provider API key found. Run setup-email-services.js first.")
      return
    }

    console.log(`📧 Detected provider: ${provider.name}`)

    const smtpConfig = this.generateSMTPConfig(provider)
    this.displaySupabaseInstructions(smtpConfig)

    // Generate email templates
    this.generateEmailTemplates()
  }

  readEnvFile() {
    if (!fs.existsSync(this.envPath)) {
      return {}
    }

    const content = fs.readFileSync(this.envPath, "utf8")
    const vars = {}

    content.split("\n").forEach((line) => {
      const [key, value] = line.split("=")
      if (key && value) {
        vars[key.trim()] = value.trim()
      }
    })

    return vars
  }

  detectProvider(envVars) {
    if (envVars.RESEND_API_KEY && envVars.RESEND_API_KEY !== "your_resend_api_key") {
      return {
        name: "Resend",
        type: "resend",
        apiKey: envVars.RESEND_API_KEY,
      }
    }
    if (envVars.SENDGRID_API_KEY && envVars.SENDGRID_API_KEY !== "your_sendgrid_api_key") {
      return {
        name: "SendGrid",
        type: "sendgrid",
        apiKey: envVars.SENDGRID_API_KEY,
      }
    }
    if (envVars.MAILGUN_API_KEY && envVars.MAILGUN_API_KEY !== "your_mailgun_api_key") {
      return {
        name: "Mailgun",
        type: "mailgun",
        apiKey: envVars.MAILGUN_API_KEY,
        domain: envVars.MAILGUN_DOMAIN,
      }
    }
    if (envVars.POSTMARK_API_KEY && envVars.POSTMARK_API_KEY !== "your_postmark_api_key") {
      return {
        name: "Postmark",
        type: "postmark",
        apiKey: envVars.POSTMARK_API_KEY,
      }
    }
    return null
  }

  generateSMTPConfig(provider) {
    const configs = {
      resend: {
        host: "smtp.resend.com",
        port: 587,
        user: "resend",
        pass: provider.apiKey,
      },
      sendgrid: {
        host: "smtp.sendgrid.net",
        port: 587,
        user: "apikey",
        pass: provider.apiKey,
      },
      mailgun: {
        host: "smtp.mailgun.org",
        port: 587,
        user: `postmaster@${provider.domain || "your-domain.mailgun.org"}`,
        pass: provider.apiKey,
      },
      postmark: {
        host: "smtp.postmarkapp.com",
        port: 587,
        user: provider.apiKey,
        pass: provider.apiKey,
      },
    }

    return configs[provider.type]
  }

  displaySupabaseInstructions(smtpConfig) {
    console.log("\n📋 Supabase SMTP Configuration:")
    console.log("=====================================")
    console.log("1. Go to your Supabase Dashboard")
    console.log("2. Navigate to Settings → Authentication")
    console.log('3. Scroll down to "SMTP Settings"')
    console.log('4. Enable "Enable custom SMTP"')
    console.log("5. Enter these values:\n")

    console.log(`   SMTP Host: ${smtpConfig.host}`)
    console.log(`   SMTP Port: ${smtpConfig.port}`)
    console.log(`   SMTP User: ${smtpConfig.user}`)
    console.log(`   SMTP Pass: ${smtpConfig.pass}`)
    console.log(`   Sender Email: noreply@yourdomain.com`)
    console.log(`   Sender Name: Medi.AI\n`)

    console.log("6. Save the configuration")
    console.log("7. Test by sending a verification email\n")
  }

  generateEmailTemplates() {
    console.log("📧 Generating custom email templates...\n")

    const templates = {
      confirmation: this.getConfirmationTemplate(),
      recovery: this.getRecoveryTemplate(),
      emailChange: this.getEmailChangeTemplate(),
    }

    // Save templates to files
    const templatesDir = path.join(process.cwd(), "email-templates")
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir)
    }

    Object.entries(templates).forEach(([name, template]) => {
      fs.writeFileSync(path.join(templatesDir, `${name}.html`), template)
    })

    console.log("✅ Email templates generated in ./email-templates/")
    console.log("\nTo use these in Supabase:")
    console.log("1. Go to Authentication → Email Templates")
    console.log("2. Copy the HTML from each template file")
    console.log("3. Paste into the corresponding Supabase template")
    console.log("4. Update the {{ .ConfirmationURL }} variables as needed\n")
  }

  getConfirmationTemplate() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Medi.AI Account</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 40px 20px; text-align: center; }
        .logo { width: 80px; height: 80px; margin: 0 auto 20px; background: white; border-radius: 16px; padding: 10px; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <img src="{{ .SiteURL }}/images/medi-ai-logo.png" alt="Medi.AI" width="60" height="60">
            </div>
            <h1>Medi.AI</h1>
        </div>
        <div class="content">
            <h2>Welcome to Medi.AI! 🎉</h2>
            <p>Thank you for joining our secure healthcare platform. We're excited to help you manage your health with AI.</p>
            <p>To get started, please verify your email address:</p>
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Verify Email Address</a>
            </div>
            <p><strong>Security Notice:</strong> This link expires in 24 hours for your security.</p>
        </div>
        <div class="footer">
            <p>© 2024 Medi.AI. All rights reserved.</p>
            <p>Secure healthcare platform powered by AI</p>
        </div>
    </div>
</body>
</html>`
  }

  getRecoveryTemplate() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Medi.AI Password</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 40px 20px; text-align: center; }
        .logo { width: 80px; height: 80px; margin: 0 auto 20px; background: white; border-radius: 16px; padding: 10px; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .security { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0; color: #92400e; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <img src="{{ .SiteURL }}/images/medi-ai-logo.png" alt="Medi.AI" width="60" height="60">
            </div>
            <h1>Medi.AI</h1>
        </div>
        <div class="content">
            <h2>Password Reset Request 🔐</h2>
            <p>We received a request to reset your password for your Medi.AI account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
            </div>
            <div class="security">
                <p><strong>Security Notice:</strong> This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2024 Medi.AI. All rights reserved.</p>
            <p>Secure healthcare platform powered by AI</p>
        </div>
    </div>
</body>
</html>`
  }

  getEmailChangeTemplate() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your New Email - Medi.AI</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 40px 20px; text-align: center; }
        .logo { width: 80px; height: 80px; margin: 0 auto 20px; background: white; border-radius: 16px; padding: 10px; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <img src="{{ .SiteURL }}/images/medi-ai-logo.png" alt="Medi.AI" width="60" height="60">
            </div>
            <h1>Medi.AI</h1>
        </div>
        <div class="content">
            <h2>Confirm Your New Email Address 📧</h2>
            <p>You've requested to change your email address for your Medi.AI account.</p>
            <p>Please confirm your new email address:</p>
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm New Email</a>
            </div>
            <p><strong>Security Notice:</strong> This link expires in 24 hours for your security.</p>
        </div>
        <div class="footer">
            <p>© 2024 Medi.AI. All rights reserved.</p>
            <p>Secure healthcare platform powered by AI</p>
        </div>
    </div>
</body>
</html>`
  }
}

// Run the configuration generator
if (require.main === module) {
  const config = new SupabaseEmailConfig()
  config.run().catch(console.error)
}

module.exports = SupabaseEmailConfig
