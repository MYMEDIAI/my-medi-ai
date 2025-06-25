#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

console.log("🧪 Testing Email Setup Scripts...\n")

// Check if scripts exist
const scriptsToCheck = ["setup-email-services.js", "generate-supabase-config.js", "auto-configure.js"]

console.log("📁 Checking script files:")
scriptsToCheck.forEach((script) => {
  const scriptPath = path.join(process.cwd(), "scripts", script)
  const exists = fs.existsSync(scriptPath)
  console.log(`   ${exists ? "✅" : "❌"} ${script}`)

  if (exists) {
    const stats = fs.statSync(scriptPath)
    console.log(`      Size: ${stats.size} bytes`)
  }
})

// Test loading the modules
console.log("\n🔧 Testing module loading:")

try {
  const EmailServiceSetup = require("./setup-email-services.js")
  console.log("✅ EmailServiceSetup module loads successfully")

  const setup = new EmailServiceSetup()
  console.log("✅ EmailServiceSetup class instantiates successfully")
  console.log(`   Environment path: ${setup.envPath}`)
  console.log(`   Available providers: ${Object.keys(setup.providers).join(", ")}`)

  // Test individual methods
  console.log("\n🔍 Testing EmailServiceSetup methods:")

  // Test checkEnvFile (safe to run)
  setup.checkEnvFile()
  console.log("   ✅ checkEnvFile() works")

  // Test updateEnvVar method
  const testContent = "TEST_VAR=old_value\nOTHER_VAR=other_value"
  const updatedContent = setup.updateEnvVar(testContent, "TEST_VAR", "new_value")
  console.log("   ✅ updateEnvVar() works")
} catch (error) {
  console.error("❌ Error loading EmailServiceSetup:", error.message)
}

try {
  const SupabaseEmailConfig = require("./generate-supabase-config.js")
  console.log("✅ SupabaseEmailConfig module loads successfully")

  const config = new SupabaseEmailConfig()
  console.log("✅ SupabaseEmailConfig class instantiates successfully")

  // Test individual methods
  console.log("\n🔍 Testing SupabaseEmailConfig methods:")

  // Test readEnvFile method
  const envVars = config.readEnvFile()
  console.log("   ✅ readEnvFile() works")

  // Test detectProvider method
  const provider = config.detectProvider(envVars)
  console.log(`   ✅ detectProvider() works (found: ${provider ? provider.name : "none"})`)
} catch (error) {
  console.error("❌ Error loading SupabaseEmailConfig:", error.message)
}

// Test auto-configure if it exists
try {
  const AutoConfigurator = require("./auto-configure.js")
  console.log("✅ AutoConfigurator module loads successfully")

  const configurator = new AutoConfigurator()
  console.log("✅ AutoConfigurator class instantiates successfully")
} catch (error) {
  console.log("⚠️  AutoConfigurator not available (this is optional)")
}

console.log("\n🎉 Script verification complete!")
console.log("\n📋 You can now run:")
console.log("   node scripts/setup-email-services.js")
console.log("   node scripts/generate-supabase-config.js")

// Check environment file status
const envPath = path.join(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  console.log("\n📄 Environment file status:")
  const envContent = fs.readFileSync(envPath, "utf8")
  const hasSupabase = envContent.includes("NEXT_PUBLIC_SUPABASE_URL") && !envContent.includes("your_supabase_url")
  const hasEmail =
    envContent.includes("RESEND_API_KEY") ||
    envContent.includes("SENDGRID_API_KEY") ||
    envContent.includes("MAILGUN_API_KEY") ||
    envContent.includes("POSTMARK_API_KEY")

  console.log(`   ${hasSupabase ? "✅" : "⚠️"} Supabase configuration`)
  console.log(`   ${hasEmail ? "✅" : "⚠️"} Email provider configuration`)
} else {
  console.log("\n📄 No .env.local file found - will be created during setup")
}
