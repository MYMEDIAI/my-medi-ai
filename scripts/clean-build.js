const fs = require("fs")
const { execSync } = require("child_process")

console.log("🧹 Cleaning for fresh build...")

// Remove all build artifacts and dependencies
const toDelete = ["node_modules", "package-lock.json", ".next", ".vercel", "dist", "build"]

toDelete.forEach((item) => {
  if (fs.existsSync(item)) {
    console.log(`🗑️  Removing ${item}`)
    execSync(`rm -rf ${item}`)
  }
})

console.log("📦 Fresh install...")
execSync("npm install", { stdio: "inherit" })

console.log("🏗️  Testing build...")
execSync("npm run build", { stdio: "inherit" })

console.log("✅ Clean build successful!")
