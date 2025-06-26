#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

console.log("🔍 Checking scripts directory...\n")

const scriptsDir = path.join(process.cwd(), "scripts")

try {
  if (!fs.existsSync(scriptsDir)) {
    console.log("❌ Scripts directory does not exist")
    console.log("📁 Creating scripts directory...")
    fs.mkdirSync(scriptsDir, { recursive: true })
    console.log("✅ Scripts directory created")
  } else {
    console.log("✅ Scripts directory exists")
  }

  const files = fs.readdirSync(scriptsDir)
  console.log(`📄 Found ${files.length} files in scripts directory:`)

  files.forEach((file) => {
    const filePath = path.join(scriptsDir, file)
    const stats = fs.statSync(filePath)
    const size = stats.size
    const type = stats.isDirectory() ? "DIR" : "FILE"
    console.log(`   ${type}: ${file} (${size} bytes)`)
  })

  // Check for specific files we need
  const requiredFiles = ["setup-email-services.js", "generate-supabase-config.js", "auto-configure.js"]

  console.log("\n🎯 Checking for required setup files:")
  requiredFiles.forEach((file) => {
    const exists = fs.existsSync(path.join(scriptsDir, file))
    console.log(`   ${exists ? "✅" : "❌"} ${file}`)
  })
} catch (error) {
  console.error("❌ Error checking scripts directory:", error.message)
}
