#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")
const https = require("https")

class AutoConfigurator {
  constructor() {
    this.envPath = path.join(process.cwd(), ".env.local")
    this.steps = [
      "checkDependencies",
      "setupDirectories",
      "setupEnvFile",
      "configureSupabase",
      "setupSiteUrl",
      "runDatabaseScripts",
      "setupEmailService",
      "verifyConfiguration",
      "generateSummary",
    ]
    this.completedSteps = []
  }

  async run() {
    console.log("🚀 Medi.AI Auto-Configuration")
    console.log("=============================\n")

    try {
      for (const step of this.steps) {
        await this[step]()
        this.completedSteps.push(step)
        console.log(`✅ ${step} completed\n`)
      }
    } catch (error) {
      console.error(`❌ Error in step: ${error.message}`)
      process.exit(1)
    }
  }

  async checkDependencies() {
    console.log("📦 Checking dependencies...")

    // Check Node.js version
    const nodeVersion = process.version
    console.log(`Node.js version: ${nodeVersion}`)

    // Install npm dependencies if needed
    if (!fs.existsSync("node_modules")) {
      console.log("Installing npm dependencies...")
      execSync("npm install", { stdio: "inherit" })
    }

    console.log("Dependencies check passed")
  }

  async setupDirectories() {
    console.log("📁 Setting up directory structure...")

    // Create necessary directories
    const directories = ["public", "public/images", "scripts", "email-templates", "docs"]

    directories.forEach((dir) => {
      const dirPath = path.join(process.cwd(), dir)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
        console.log(`Created directory: ${dir}`)
      }
    })

    // Fix any directory/file conflicts
    const logoPath = path.join(process.cwd(), "public", "images", "medi-ai-logo.png")

    try {
      const stat = fs.statSync(logoPath)
      if (stat.isDirectory()) {
        console.log("🗑️  Removing incorrect directory at logo path...")
        fs.rmSync(logoPath, { recursive: true, force: true })
      }
    } catch (error) {
      // File doesn't exist, which is fine
    }

    // Create placeholder logo if needed
    if (!fs.existsSync(logoPath) || fs.statSync(logoPath).isDirectory()) {
      console.log("📝 Creating placeholder logo...")
      const placeholderSvg = `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="60" rx="12" fill="#8b5cf6"/>
  <rect x="10" y="10" width="40" height="40" rx="8" fill="#a855f7"/>
  <rect x="15" y="15" width="30" height="30" rx="6" fill="#c084fc"/>
  <text x="30" y="38" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">M</text>
</svg>`

      // For now, create a simple text file as placeholder
      fs.writeFileSync(logoPath + ".svg", placeholderSvg)
      console.log("Placeholder logo created as SVG")
    }

    console.log("Directory structure setup complete")
  }

  async setupEnvFile() {
    console.log("📝 Setting up environment file...")

    if (!fs.existsSync(this.envPath)) {
      const examplePath = path.join(process.cwd(), ".env.example")

      if (fs.existsSync(examplePath)) {
        fs.copyFileSync(examplePath, this.envPath)
        console.log("Created .env.local from template")
      } else {
        // Create basic .env.local
        const basicEnv = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Service Provider
RESEND_API_KEY=your_resend_api_key
`
        fs.writeFileSync(this.envPath, basicEnv)
        console.log("Created basic .env.local file")
      }
    } else {
      console.log(".env.local already exists")
    }
  }

  async configureSupabase() {
    console.log("🗄️  Configuring Supabase integration...")

    const envContent = fs.readFileSync(this.envPath, "utf8")

    // Check if Supabase is already configured
    if (envContent.includes("your_supabase_url") || !this.getEnvValue("NEXT_PUBLIC_SUPABASE_URL")) {
      console.log("\n📋 Supabase Setup Required:")
      console.log("1. Go to https://supabase.com/dashboard")
      console.log("2. Create a new project or select existing")
      console.log("3. Go to Settings → API")
      console.log("4. Copy your Project URL and API keys\n")

      const supabaseUrl = await this.promptUser("Enter your Supabase Project URL: ")
      const supabaseAnonKey = await this.promptUser("Enter your Supabase Anon Key: ")
      const supabaseServiceKey = await this.promptUser("Enter your Supabase Service Role Key: ")

      this.updateEnvVar("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl)
      this.updateEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey)
      this.updateEnvVar("SUPABASE_SERVICE_ROLE_KEY", supabaseServiceKey)

      console.log("Supabase credentials configured")
    } else {
      console.log("Supabase already configured")
    }
  }

  async setupSiteUrl() {
    console.log("🌐 Setting up site URL...")

    const currentUrl = this.getEnvValue("NEXT_PUBLIC_SITE_URL")

    if (!currentUrl || currentUrl.includes("your-domain.com")) {
      console.log("\n🌐 Site URL Configuration:")
      console.log("For development: http://localhost:3000")
      console.log("For production: https://yourdomain.com\n")

      const siteUrl = await this.promptUser("Enter your site URL (default: http://localhost:3000): ")
      const finalUrl = siteUrl.trim() || "http://localhost:3000"

      this.updateEnvVar("NEXT_PUBLIC_SITE_URL", finalUrl)
      console.log(`Site URL configured: ${finalUrl}`)
    } else {
      console.log(`Site URL already configured: ${currentUrl}`)
    }
  }

  async runDatabaseScripts() {
    console.log("🗃️  Setting up database schema...")

    const scripts = [
      "scripts/01-create-tables.sql",
      "scripts/02-rls-policies.sql",
      "scripts/03-additional-indexes.sql",
      "scripts/04-validation-functions.sql",
      "scripts/05-views-and-functions.sql",
      "scripts/fix-rls-policies.sql",
      "scripts/update-users-table.sql",
    ]

    console.log("\n📋 Database Setup Instructions:")
    console.log("1. Go to your Supabase Dashboard")
    console.log("2. Navigate to SQL Editor")
    console.log("3. Run these scripts in order:\n")

    scripts.forEach((script, index) => {
      if (fs.existsSync(script)) {
        console.log(`   ${index + 1}. ${script}`)
      }
    })

    console.log("\n⚠️  Important: Run scripts in the exact order shown above")

    await this.promptUser("\nPress Enter when you've completed the database setup...")
    console.log("Database setup marked as complete")
  }

  async setupEmailService() {
    console.log("📧 Setting up email service...")

    console.log("\n📧 Email Service Options:")
    console.log("1. 🚀 Quick Setup (Resend - Recommended)")
    console.log("2. 🔧 Custom Setup (Choose provider)")
    console.log("3. ⏭️  Skip for now\n")

    const choice = await this.promptUser("Choose option (1-3): ")

    switch (choice.trim()) {
      case "1":
        await this.setupResendQuick()
        break
      case "2":
        await this.setupCustomEmail()
        break
      case "3":
        console.log("Email setup skipped")
        break
      default:
        console.log("Invalid choice, skipping email setup")
    }
  }

  async setupResendQuick() {
    console.log("🚀 Setting up Resend (recommended)...")

    console.log("\n🔗 Please visit: https://resend.com/signup")
    console.log("\n📋 Resend Setup Steps:")
    console.log("1. Sign up for a free account")
    console.log("2. Go to Dashboard → API Keys")
    console.log("3. Click 'Create API Key'")
    console.log("4. Copy your API key\n")

    // Try to open the URL
    this.openUrl("https://resend.com/signup")

    const apiKey = await this.promptUser("Paste your Resend API key (or press Enter to skip): ")

    if (apiKey.trim()) {
      this.updateEnvVar("RESEND_API_KEY", apiKey.trim())
      console.log("✅ Resend API key configured")

      // Generate Supabase email configuration
      await this.generateSupabaseEmailConfig()
    } else {
      console.log("Resend setup skipped")
    }
  }

  async setupCustomEmail() {
    console.log("🔧 Custom email provider setup...")

    const providers = {
      1: { name: "SendGrid", key: "SENDGRID_API_KEY", url: "https://signup.sendgrid.com" },
      2: { name: "Mailgun", key: "MAILGUN_API_KEY", url: "https://signup.mailgun.com" },
      3: { name: "Postmark", key: "POSTMARK_API_KEY", url: "https://postmarkapp.com/sign_up" },
    }

    console.log("\nChoose your email provider:")
    Object.entries(providers).forEach(([num, provider]) => {
      console.log(`${num}. ${provider.name}`)
    })

    const choice = await this.promptUser("\nEnter choice (1-3): ")
    const provider = providers[choice.trim()]

    if (provider) {
      console.log(`\nSetting up ${provider.name}...`)
      console.log(`Please visit: ${provider.url}`)

      this.openUrl(provider.url)

      const apiKey = await this.promptUser(`Enter your ${provider.name} API key: `)
      if (apiKey.trim()) {
        this.updateEnvVar(provider.key, apiKey.trim())
        console.log(`✅ ${provider.name} configured`)
      }
    }
  }

  async generateSupabaseEmailConfig() {
    console.log("📧 Generating Supabase email configuration...")

    const resendKey = this.getEnvValue("RESEND_API_KEY")
    if (!resendKey) return

    const smtpConfig = {
      host: "smtp.resend.com",
      port: 587,
      user: "resend",
      pass: resendKey,
    }

    console.log("\n📋 Supabase SMTP Configuration:")
    console.log("=====================================")
    console.log("1. Go to Supabase Dashboard → Settings → Authentication")
    console.log('2. Enable "Custom SMTP"')
    console.log("3. Enter these values:\n")
    console.log(`   SMTP Host: ${smtpConfig.host}`)
    console.log(`   SMTP Port: ${smtpConfig.port}`)
    console.log(`   SMTP User: ${smtpConfig.user}`)
    console.log(`   SMTP Pass: ${smtpConfig.pass}`)
    console.log(`   Sender Email: noreply@yourdomain.com`)
    console.log(`   Sender Name: Medi.AI\n`)

    await this.promptUser("Press Enter when you've configured Supabase SMTP...")
  }

  async verifyConfiguration() {
    console.log("🔍 Verifying configuration...")

    const checks = [
      {
        name: "Environment file",
        check: () => fs.existsSync(this.envPath),
      },
      {
        name: "Public images directory",
        check: () => fs.existsSync(path.join(process.cwd(), "public", "images")),
      },
      {
        name: "Supabase URL",
        check: () => {
          const url = this.getEnvValue("NEXT_PUBLIC_SUPABASE_URL")
          return url && url.includes("supabase.co")
        },
      },
      {
        name: "Supabase Anon Key",
        check: () => {
          const key = this.getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY")
          return key && key.length > 50
        },
      },
      {
        name: "Site URL",
        check: () => {
          const url = this.getEnvValue("NEXT_PUBLIC_SITE_URL")
          return url && (url.startsWith("http://") || url.startsWith("https://"))
        },
      },
      {
        name: "Email Provider",
        check: () => {
          const providers = ["RESEND_API_KEY", "SENDGRID_API_KEY", "MAILGUN_API_KEY", "POSTMARK_API_KEY"]
          return providers.some((key) => this.getEnvValue(key))
        },
      },
    ]

    let passed = 0
    const total = checks.length

    checks.forEach((check) => {
      if (check.check()) {
        console.log(`✅ ${check.name}`)
        passed++
      } else {
        console.log(`⚠️  ${check.name} - needs attention`)
      }
    })

    console.log(`\nVerification: ${passed}/${total} checks passed`)
  }

  async generateSummary() {
    console.log("\n🎉 Auto-Configuration Complete!")
    console.log("===============================\n")

    console.log("✅ Configuration Summary:")
    this.completedSteps.forEach((step) => {
      console.log(`   • ${step}`)
    })

    console.log("\n📋 Next Steps:")
    console.log("1. Start development server: npm run dev")
    console.log("2. Test user registration and email verification")
    console.log("3. Customize your application as needed\n")

    console.log("🔧 Useful Commands:")
    console.log("• npm run dev              - Start development server")
    console.log("• npm run setup-email      - Reconfigure email service")
    console.log("• npm run config-supabase  - Regenerate Supabase config\n")

    console.log("🚀 Your Medi.AI platform is ready for development!")
  }

  // Helper methods
  getEnvValue(key) {
    if (!fs.existsSync(this.envPath)) return null

    const content = fs.readFileSync(this.envPath, "utf8")
    const match = content.match(new RegExp(`^${key}=(.*)$`, "m"))
    return match ? match[1].trim() : null
  }

  updateEnvVar(key, value) {
    let content = fs.readFileSync(this.envPath, "utf8")
    const regex = new RegExp(`^${key}=.*$`, "m")

    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`)
    } else {
      content += `\n${key}=${value}`
    }

    fs.writeFileSync(this.envPath, content)
  }

  promptUser(question) {
    return new Promise((resolve) => {
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      readline.question(question, (answer) => {
        readline.close()
        resolve(answer)
      })
    })
  }

  openUrl(url) {
    const platform = process.platform
    try {
      if (platform === "darwin") {
        execSync(`open "${url}"`, { stdio: "ignore" })
      } else if (platform === "win32") {
        execSync(`start "${url}"`, { stdio: "ignore" })
      } else {
        execSync(`xdg-open "${url}"`, { stdio: "ignore" })
      }
    } catch (error) {
      console.log(`Please open this URL manually: ${url}`)
    }
  }
}

// Run the auto-configurator
if (require.main === module) {
  const configurator = new AutoConfigurator()
  configurator.run().catch(console.error)
}

module.exports = AutoConfigurator
