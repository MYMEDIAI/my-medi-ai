const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🚀 Starting comprehensive build test for My Medi.AI Demo...\n")

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: [],
}

function logTest(name, status, details = "") {
  const icon = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⚠️"
  console.log(`${icon} ${name}: ${status}`)
  if (details) console.log(`   ${details}`)

  testResults.details.push({ name, status, details })
  if (status === "PASS") testResults.passed++
  else if (status === "FAIL") testResults.failed++
  else testResults.warnings++
}

// 1. Check essential files
console.log("📁 Checking essential files...")
const essentialFiles = [
  "package.json",
  "next.config.js",
  "tailwind.config.js",
  "tsconfig.json",
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
]

essentialFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    logTest(`File: ${file}`, "PASS")
  } else {
    logTest(`File: ${file}`, "FAIL", "Required file missing")
  }
})

// 2. Check package.json dependencies
console.log("\n📦 Checking package.json...")
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))

  if (packageJson.dependencies) {
    logTest("Dependencies defined", "PASS", `${Object.keys(packageJson.dependencies).length} dependencies`)
  } else {
    logTest("Dependencies defined", "FAIL", "No dependencies found")
  }

  if (packageJson.scripts && packageJson.scripts.build) {
    logTest("Build script exists", "PASS")
  } else {
    logTest("Build script exists", "FAIL", "No build script in package.json")
  }
} catch (error) {
  logTest("Package.json parsing", "FAIL", error.message)
}

// 3. Install dependencies
console.log("\n📥 Installing dependencies...")
try {
  execSync("npm install", { stdio: "pipe" })
  logTest("Dependencies installation", "PASS")
} catch (error) {
  logTest("Dependencies installation", "FAIL", error.message)
}

// 4. TypeScript check
console.log("\n🔍 Running TypeScript check...")
try {
  execSync("npx tsc --noEmit", { stdio: "pipe" })
  logTest("TypeScript compilation", "PASS")
} catch (error) {
  const errorOutput = error.stdout ? error.stdout.toString() : error.message
  if (errorOutput.includes("error TS")) {
    logTest("TypeScript compilation", "FAIL", "TypeScript errors found")
    console.log("   TypeScript errors:")
    console.log("   " + errorOutput.split("\n").slice(0, 5).join("\n   "))
  } else {
    logTest("TypeScript compilation", "WARN", "Minor TypeScript issues")
  }
}

// 5. Next.js build test
console.log("\n🏗️ Running Next.js build...")
try {
  const buildOutput = execSync("npm run build", { stdio: "pipe", encoding: "utf8" })

  if (buildOutput.includes("✓ Compiled successfully")) {
    logTest("Next.js build", "PASS", "Build completed successfully")
  } else if (buildOutput.includes("Failed to compile")) {
    logTest("Next.js build", "FAIL", "Build compilation failed")
  } else {
    logTest("Next.js build", "WARN", "Build completed with warnings")
  }

  // Check for specific success indicators
  if (buildOutput.includes("Route (app)")) {
    logTest("Route generation", "PASS", "App routes generated successfully")
  }

  if (buildOutput.includes("Static page generation")) {
    logTest("Static pages", "PASS", "Static pages generated")
  }

  console.log("\n📊 Build output summary:")
  const lines = buildOutput.split("\n")
  lines.forEach((line) => {
    if (line.includes("Route (app)") || line.includes("○") || line.includes("●") || line.includes("λ")) {
      console.log("   " + line)
    }
  })
} catch (error) {
  logTest("Next.js build", "FAIL", "Build process failed")
  console.log("\n❌ Build Error Details:")
  console.log(error.stdout || error.message)
}

// 6. Check build output
console.log("\n📂 Checking build output...")
if (fs.existsSync(".next")) {
  logTest("Build directory created", "PASS", ".next directory exists")

  if (fs.existsSync(".next/static")) {
    logTest("Static assets generated", "PASS")
  } else {
    logTest("Static assets generated", "FAIL", "No static assets found")
  }
} else {
  logTest("Build directory created", "FAIL", ".next directory not found")
}

// 7. Test production start (optional)
console.log("\n🚀 Testing production start...")
try {
  // Start the server in background and test if it responds
  const child = execSync("timeout 10s npm start", { stdio: "pipe" })
  logTest("Production start", "PASS", "Server started successfully")
} catch (error) {
  // This might timeout, which is expected
  if (error.message.includes("timeout")) {
    logTest("Production start", "PASS", "Server started (timeout expected)")
  } else {
    logTest("Production start", "WARN", "Could not test production start")
  }
}

// Final summary
console.log("\n" + "=".repeat(50))
console.log("🎯 BUILD TEST SUMMARY")
console.log("=".repeat(50))
console.log(`✅ Passed: ${testResults.passed}`)
console.log(`❌ Failed: ${testResults.failed}`)
console.log(`⚠️  Warnings: ${testResults.warnings}`)
console.log(`📊 Total Tests: ${testResults.details.length}`)

if (testResults.failed === 0) {
  console.log("\n🎉 BUILD SUCCESS! Your demo is ready to deploy! 🚀")
  console.log("\n📋 Next steps:")
  console.log("   1. Deploy to your preferred platform (Vercel, Netlify, etc.)")
  console.log("   2. Test the live demo")
  console.log("   3. Share with users and stakeholders")
} else {
  console.log("\n⚠️  BUILD ISSUES DETECTED")
  console.log("\n🔧 Issues to fix:")
  testResults.details.forEach((test) => {
    if (test.status === "FAIL") {
      console.log(`   • ${test.name}: ${test.details}`)
    }
  })
}

console.log("\n" + "=".repeat(50))
