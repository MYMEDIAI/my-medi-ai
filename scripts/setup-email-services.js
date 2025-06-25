#!/usr/bin/env node

const https = require("https")
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

class EmailServiceSetup {
  constructor() {
    this.envPath = path.join(process.cwd(), ".env.local")
    this.providers = {
      resend: {
        name: "Resend",
        signupUrl: "https://resend.com/signup",
        apiUrl: "https://api.resend.com",
        instructions: "Go to Dashboard → API Keys → Create API Key",
      },
      sendgrid: {
        name: "SendGrid",
        signupUrl: "https://signup.sendgrid.com",
        apiUrl: "https://api.sendgrid.com",
        instructions: "Go to Settings → API Keys → Create API Key",
      },
      mailgun: {
        name: "Mailgun",
        signupUrl: "https://signup.mailgun.com",
        apiUrl: "https://api.mailgun.net",
        instructions: "Go to Sending → Domain Settings → API Keys",
      },
      postmark: {
        name: "Postmark",
        signupUrl: "https://postmarkapp.com/sign_up",
        apiUrl: "https://api.postmarkapp.com",
        instructions: "Go to Servers → Your Server → API Tokens",
      },
    }
  }

  async run() {
    console.log("🚀 Medi.AI Email Service Setup\n")

    // Check if .env.local exists
    this.checkEnvFile()

    // Show provider options
    this.showProviderOptions()

    // Get user choice
    const choice = await this.getUserChoice()

    // Setup chosen provider
    await this.setupProvider(choice)

    console.log("\n✅ Email service setup complete!")
    console.log("🔧 Next steps:")
    console.log("1. Configure Supabase SMTP settings")
    console.log("2. Test your email templates")
    console.log("3. Deploy your application")
  }

  checkEnvFile() {
    if (!fs.existsSync(this.envPath)) {
      console.log("📝 Creating .env.local file...")
      fs.copyFileSync(".env.example", this.envPath)
    }
  }

  showProviderOptions() {
    console.log("📧 Choose your email service provider:\n")
    console.log("1. 🥇 Resend (Recommended for startups)")
    console.log("   • 3,000 emails/month free")
    console.log("   • Developer-friendly")
    console.log("   • Excellent deliverability\n")

    console.log("2. 🏢 SendGrid (Enterprise-grade)")
    console.log("   • 100 emails/day free")
    console.log("   • Advanced analytics")
    console.log("   • HIPAA compliance options\n")

    console.log("3. 🔧 Mailgun (Developer favorite)")
    console.log("   • 5,000 emails/month free (3 months)")
    console.log("   • Powerful API")
    console.log("   • Good for transactional emails\n")

    console.log("4. 📈 Postmark (High deliverability)")
    console.log("   • 100 emails/month free")
    console.log("   • 99%+ delivery rates")
    console.log("   • Fast delivery\n")
  }

  async getUserChoice() {
    return new Promise((resolve) => {
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      readline.question("Enter your choice (1-4): ", (answer) => {
        const choices = ["resend", "sendgrid", "mailgun", "postmark"]
        const choice = choices[Number.parseInt(answer) - 1]
        readline.close()
        resolve(choice || "resend")
      })
    })
  }

  async setupProvider(provider) {
    const config = this.providers[provider]
    console.log(`\n🔧 Setting up ${config.name}...\n`)

    // Open signup page
    console.log(`1. Opening ${config.name} signup page...`)
    this.openUrl(config.signupUrl)

    await this.wait(3000)

    console.log(`\n2. Follow these steps to get your API key:`)
    console.log(`   ${config.instructions}`)

    // Get API key from user
    const apiKey = await this.getApiKey(provider)

    // Update .env file
    this.updateEnvFile(provider, apiKey)

    // Test the API key
    await this.testApiKey(provider, apiKey)
  }

  async getApiKey(provider) {
    return new Promise((resolve) => {
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      console.log("\n3. Paste your API key here:")
      readline.question("API Key: ", (apiKey) => {
        readline.close()
        resolve(apiKey.trim())
      })
    })
  }

  updateEnvFile(provider, apiKey) {
    console.log("\n4. Updating environment variables...")

    let envContent = fs.readFileSync(this.envPath, "utf8")

    switch (provider) {
      case "resend":
        envContent = this.updateEnvVar(envContent, "RESEND_API_KEY", apiKey)
        break
      case "sendgrid":
        envContent = this.updateEnvVar(envContent, "SENDGRID_API_KEY", apiKey)
        break
      case "mailgun":
        envContent = this.updateEnvVar(envContent, "MAILGUN_API_KEY", apiKey)
        // Also ask for domain
        console.log("\nMailgun also requires a domain. Check your Mailgun dashboard for your domain.")
        break
      case "postmark":
        envContent = this.updateEnvVar(envContent, "POSTMARK_API_KEY", apiKey)
        break
    }

    fs.writeFileSync(this.envPath, envContent)
    console.log("✅ Environment variables updated!")
  }

  updateEnvVar(content, key, value) {
    const regex = new RegExp(`^${key}=.*$`, "m")
    if (regex.test(content)) {
      return content.replace(regex, `${key}=${value}`)
    } else {
      return content + `\n${key}=${value}`
    }
  }

  async testApiKey(provider, apiKey) {
    console.log("\n5. Testing API key...")

    try {
      const isValid = await this.validateApiKey(provider, apiKey)
      if (isValid) {
        console.log("✅ API key is valid!")
      } else {
        console.log("❌ API key validation failed. Please check your key.")
      }
    } catch (error) {
      console.log("⚠️  Could not validate API key automatically. Please test manually.")
    }
  }

  async validateApiKey(provider, apiKey) {
    return new Promise((resolve) => {
      let options = {}

      switch (provider) {
        case "resend":
          options = {
            hostname: "api.resend.com",
            path: "/domains",
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
          break
        case "sendgrid":
          options = {
            hostname: "api.sendgrid.com",
            path: "/v3/user/profile",
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
          break
        default:
          resolve(true) // Skip validation for other providers
          return
      }

      const req = https.request(options, (res) => {
        resolve(res.statusCode === 200)
      })

      req.on("error", () => resolve(false))
      req.end()
    })
  }

  openUrl(url) {
    const platform = process.platform
    try {
      if (platform === "darwin") {
        execSync(`open "${url}"`)
      } else if (platform === "win32") {
        execSync(`start "${url}"`)
      } else {
        execSync(`xdg-open "${url}"`)
      }
    } catch (error) {
      console.log(`Please open this URL manually: ${url}`)
    }
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// Run the setup
if (require.main === module) {
  const setup = new EmailServiceSetup()
  setup.run().catch(console.error)
}

module.exports = EmailServiceSetup
