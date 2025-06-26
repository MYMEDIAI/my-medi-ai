#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

console.log("🚀 Starting Medi.AI Complete Setup...\n")

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local")
if (!fs.existsSync(envPath)) {
  console.log("❌ .env.local file not found!")
  console.log("📝 Please create .env.local with your environment variables:")
  console.log("   - NEXT_PUBLIC_SUPABASE_URL")
  console.log("   - NEXT_PUBLIC_SUPABASE_ANON_KEY")
  console.log("   - SUPABASE_SERVICE_ROLE_KEY")
  console.log("   - NEXT_PUBLIC_SITE_URL")
  console.log("   - Email service keys (RESEND_API_KEY, etc.)\n")
  process.exit(1)
}

console.log("✅ Environment file found")

// Check Node.js version
const nodeVersion = process.version
const majorVersion = Number.parseInt(nodeVersion.slice(1).split(".")[0])

if (majorVersion < 20) {
  console.log(`❌ Node.js version ${nodeVersion} is not supported`)
  console.log("📝 Please upgrade to Node.js 20 or higher")
  process.exit(1)
}

console.log(`✅ Node.js version ${nodeVersion} is supported`)

// Check if dependencies are installed
const nodeModulesPath = path.join(process.cwd(), "node_modules")
if (!fs.existsSync(nodeModulesPath)) {
  console.log("❌ Dependencies not installed")
  console.log("📝 Please run: npm install")
  process.exit(1)
}

console.log("✅ Dependencies are installed")

// Check critical files
const criticalFiles = ["app/layout.tsx", "app/page.tsx", "lib/supabase.ts", "components/ui/button.tsx"]

const missingFiles = []
for (const file of criticalFiles) {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    missingFiles.push(file)
  }
}

if (missingFiles.length > 0) {
  console.log("❌ Missing critical files:")
  missingFiles.forEach((file) => console.log(`   - ${file}`))
  process.exit(1)
}

console.log("✅ All critical files are present")

console.log("\n🎉 Setup verification completed successfully!")
console.log("\n📋 Next steps:")
console.log("1. Run database setup: npm run setup-database")
console.log("2. Configure email services: npm run setup-email")
console.log("3. Test the build: npm run test-build")
console.log("4. Start development: npm run dev")
console.log("\n🌟 Your Medi.AI project is ready to go!")
