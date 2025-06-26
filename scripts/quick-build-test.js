const { execSync } = require("child_process")

console.log("🚀 Quick Build Test for My Medi.AI Demo\n")

try {
  console.log("📦 Installing dependencies...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully\n")

  console.log("🏗️ Running build...")
  const buildOutput = execSync("npm run build", { stdio: "pipe", encoding: "utf8" })

  console.log("✅ BUILD SUCCESSFUL! 🎉\n")

  // Show key build information
  const lines = buildOutput.split("\n")
  console.log("📊 Build Summary:")
  lines.forEach((line) => {
    if (
      line.includes("Route (app)") ||
      line.includes("○") ||
      line.includes("●") ||
      line.includes("✓ Compiled") ||
      line.includes("Creating an optimized production build")
    ) {
      console.log("   " + line)
    }
  })

  console.log("\n🎯 Your demo is ready to deploy!")
  console.log("\n📋 Deployment options:")
  console.log("   • Vercel: vercel --prod")
  console.log("   • Netlify: netlify deploy --prod")
  console.log("   • Manual: Upload .next folder to your hosting")
} catch (error) {
  console.log("❌ BUILD FAILED\n")
  console.log("Error details:")
  console.log(error.stdout || error.message)

  console.log("\n🔧 Common fixes:")
  console.log("   • Check for TypeScript errors")
  console.log("   • Verify all imports are correct")
  console.log("   • Ensure all required files exist")
  console.log("   • Run: npm install --force")
}
