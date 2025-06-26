const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🔍 Debugging build issues...\n")

// Check if UI components exist
const uiComponents = ["button", "input", "label", "card", "alert"]
console.log("📁 Checking UI components:")
uiComponents.forEach((component) => {
  const filePath = path.join(process.cwd(), "components", "ui", `${component}.tsx`)
  const exists = fs.existsSync(filePath)
  console.log(`  ${exists ? "✅" : "❌"} components/ui/${component}.tsx`)

  if (exists) {
    try {
      const content = fs.readFileSync(filePath, "utf8")
      const hasExport =
        content.includes(`export`) && content.includes(component.charAt(0).toUpperCase() + component.slice(1))
      console.log(`    ${hasExport ? "✅" : "❌"} Has proper export`)
    } catch (e) {
      console.log(`    ❌ Error reading file: ${e.message}`)
    }
  }
})

console.log("\n📦 Checking package.json dependencies:")
try {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
  const requiredDeps = ["@radix-ui/react-slot", "class-variance-authority", "tailwind-merge"]

  requiredDeps.forEach((dep) => {
    const exists = pkg.dependencies[dep] || pkg.devDependencies[dep]
    console.log(`  ${exists ? "✅" : "❌"} ${dep}`)
  })
} catch (e) {
  console.log(`  ❌ Error reading package.json: ${e.message}`)
}

console.log("\n🔧 Checking lib/utils.ts:")
const utilsPath = path.join(process.cwd(), "lib", "utils.ts")
if (fs.existsSync(utilsPath)) {
  try {
    const content = fs.readFileSync(utilsPath, "utf8")
    const hasCn = content.includes("export") && content.includes("cn")
    console.log(`  ${hasCn ? "✅" : "❌"} cn function exported`)
  } catch (e) {
    console.log(`  ❌ Error reading utils: ${e.message}`)
  }
} else {
  console.log("  ❌ lib/utils.ts not found")
}

console.log("\n🏗️ Running build with verbose output...")
try {
  execSync("npm run build", { stdio: "inherit" })
  console.log("✅ Build successful!")
} catch (error) {
  console.log("❌ Build failed")
  process.exit(1)
}
