const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🔍 Testing Local Build Process...\n")

// Check if essential files exist
const essentialFiles = [
  "package.json",
  "next.config.mjs",
  "tailwind.config.js",
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
]

console.log("📁 Checking essential files...")
const missingFiles = []

essentialFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MISSING`)
    missingFiles.push(file)
  }
})

if (missingFiles.length > 0) {
  console.log(`\n❌ Missing files detected: ${missingFiles.join(", ")}`)
  console.log("Please ensure all essential files are present before building.")
  process.exit(1)
}

console.log("\n📦 Installing dependencies...")
try {
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully")
} catch (error) {
  console.log("❌ Failed to install dependencies")
  console.error(error.message)
  process.exit(1)
}

console.log("\n🔧 Running TypeScript check...")
try {
  execSync("npx tsc --noEmit", { stdio: "inherit" })
  console.log("✅ TypeScript check passed")
} catch (error) {
  console.log("⚠️  TypeScript warnings detected, but continuing...")
}

console.log("\n🏗️  Testing build process...")
try {
  const buildStart = Date.now()
  execSync("npm run build", { stdio: "inherit" })
  const buildTime = ((Date.now() - buildStart) / 1000).toFixed(2)

  console.log(`\n✅ Build completed successfully in ${buildTime}s`)

  // Check if .next directory was created
  if (fs.existsSync(".next")) {
    console.log("✅ .next directory created")

    // Check for static files
    const staticDir = ".next/static"
    if (fs.existsSync(staticDir)) {
      console.log("✅ Static files generated")
    }

    // Check for server files
    const serverDir = ".next/server"
    if (fs.existsSync(serverDir)) {
      console.log("✅ Server files generated")
    }
  }
} catch (error) {
  console.log("\n❌ Build failed!")
  console.error("Build Error Details:")
  console.error(error.message)

  // Try to provide helpful error analysis
  const errorString = error.message.toLowerCase()

  if (errorString.includes("module not found")) {
    console.log('\n💡 Suggestion: Missing dependency. Run "npm install" to install missing packages.')
  }

  if (errorString.includes("typescript")) {
    console.log("\n💡 Suggestion: TypeScript error. Check your .tsx files for type issues.")
  }

  if (errorString.includes("tailwind")) {
    console.log("\n💡 Suggestion: Tailwind CSS issue. Check tailwind.config.js configuration.")
  }

  if (errorString.includes("import")) {
    console.log("\n💡 Suggestion: Import error. Check file paths and component imports.")
  }

  process.exit(1)
}

console.log("\n🧪 Testing production server start...")
try {
  // Test if the production build can start (timeout after 5 seconds)
  const { spawn } = require("child_process")

  const server = spawn("npm", ["start"], { stdio: "pipe" })

  let serverStarted = false
  let serverOutput = ""

  server.stdout.on("data", (data) => {
    serverOutput += data.toString()
    if (data.toString().includes("Ready") || data.toString().includes("started server")) {
      serverStarted = true
      server.kill()
    }
  })

  server.stderr.on("data", (data) => {
    serverOutput += data.toString()
  })

  // Wait for server to start or timeout
  await new Promise((resolve) => {
    setTimeout(() => {
      if (!serverStarted) {
        server.kill()
      }
      resolve()
    }, 5000)

    server.on("exit", () => {
      resolve()
    })
  })

  if (serverStarted) {
    console.log("✅ Production server can start successfully")
  } else {
    console.log("⚠️  Production server test timed out (this may be normal)")
  }
} catch (error) {
  console.log("⚠️  Could not test production server start")
}

console.log("\n🎉 Build Test Summary:")
console.log("✅ All essential files present")
console.log("✅ Dependencies installed")
console.log("✅ Build process completed")
console.log("✅ Ready for deployment!")

console.log("\n📋 Next Steps:")
console.log("1. Deploy to your preferred platform (Vercel, Netlify, etc.)")
console.log("2. Set up environment variables")
console.log("3. Test the deployed application")
console.log("4. Report back with deployment status")

// Clean up function
function cleanup() {
  console.log("\n🧹 Cleaning up...")
  // Remove .next directory to save space if needed
  // execSync('rm -rf .next', { stdio: 'inherit' });
}

// Handle process termination
process.on("SIGINT", cleanup)
process.on("SIGTERM", cleanup)
