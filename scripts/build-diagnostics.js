const fs = require("fs")
const path = require("path")

console.log("🔍 Running Build Diagnostics...\n")

// Check Node.js version
console.log(`Node.js Version: ${process.version}`)

// Check npm version
try {
  const { execSync } = require("child_process")
  const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim()
  console.log(`NPM Version: ${npmVersion}`)
} catch (error) {
  console.log("Could not determine NPM version")
}

// Check package.json
if (fs.existsSync("package.json")) {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
  console.log(`\nProject: ${packageJson.name}`)
  console.log(`Version: ${packageJson.version}`)

  // Check for potential issues
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

  console.log("\n📦 Dependency Analysis:")

  // Check Next.js version
  if (dependencies.next) {
    console.log(`✅ Next.js: ${dependencies.next}`)
  } else {
    console.log("❌ Next.js not found in dependencies")
  }

  // Check React version
  if (dependencies.react && dependencies["react-dom"]) {
    console.log(`✅ React: ${dependencies.react}`)
    console.log(`✅ React DOM: ${dependencies["react-dom"]}`)
  } else {
    console.log("❌ React or React DOM missing")
  }

  // Check TypeScript
  if (dependencies.typescript) {
    console.log(`✅ TypeScript: ${dependencies.typescript}`)
  } else {
    console.log("⚠️  TypeScript not found (may be using JavaScript)")
  }

  // Check Tailwind CSS
  if (dependencies.tailwindcss) {
    console.log(`✅ Tailwind CSS: ${dependencies.tailwindcss}`)
  } else {
    console.log("❌ Tailwind CSS not found")
  }
}

// Check configuration files
console.log("\n⚙️  Configuration Files:")

const configFiles = [
  "next.config.mjs",
  "next.config.js",
  "tailwind.config.js",
  "tailwind.config.ts",
  "tsconfig.json",
  "postcss.config.js",
]

configFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - Not found`)
  }
})

// Check app structure
console.log("\n📁 App Structure:")

const appStructure = ["app", "app/layout.tsx", "app/page.tsx", "app/globals.css", "components", "lib", "public"]

appStructure.forEach((item) => {
  if (fs.existsSync(item)) {
    const stats = fs.statSync(item)
    const type = stats.isDirectory() ? "directory" : "file"
    console.log(`✅ ${item} (${type})`)
  } else {
    console.log(`❌ ${item} - Not found`)
  }
})

console.log("\n🔍 Diagnostics Complete")
