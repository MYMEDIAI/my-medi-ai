const fs = require("fs")
const path = require("path")

console.log("🔍 Checking import/export consistency...\n")

// Find all TypeScript/React files
function findTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory() && !item.startsWith(".") && item !== "node_modules") {
      findTsxFiles(fullPath, files)
    } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
      files.push(fullPath)
    }
  }

  return files
}

// Extract imports from file content
function extractImports(content) {
  const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)?\s*(?:,\s*{[^}]*})?\s*from\s+['"]([^'"]+)['"]/g
  const imports = []
  let match

  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1])
  }

  return imports
}

// Check if import path exists
function checkImportPath(importPath, fromFile) {
  if (importPath.startsWith(".")) {
    // Relative import
    const basePath = path.dirname(fromFile)
    const fullPath = path.resolve(basePath, importPath)

    // Try different extensions
    const extensions = [".tsx", ".ts", ".js", ".jsx", "/index.tsx", "/index.ts"]

    for (const ext of extensions) {
      if (fs.existsSync(fullPath + ext)) {
        return true
      }
    }

    return false
  } else if (importPath.startsWith("@/")) {
    // Absolute import with @ alias
    const relativePath = importPath.replace("@/", "")
    const fullPath = path.resolve(relativePath)

    const extensions = [".tsx", ".ts", ".js", ".jsx", "/index.tsx", "/index.ts"]

    for (const ext of extensions) {
      if (fs.existsSync(fullPath + ext)) {
        return true
      }
    }

    return false
  }

  // External package - assume it exists if in package.json
  return true
}

const files = findTsxFiles(".")
let hasErrors = false

console.log(`Found ${files.length} TypeScript files to check\n`)

for (const file of files) {
  try {
    const content = fs.readFileSync(file, "utf8")
    const imports = extractImports(content)

    console.log(`📄 ${file}`)

    for (const importPath of imports) {
      if (!importPath.startsWith("react") && !importPath.startsWith("next") && !importPath.startsWith("lucide-react")) {
        const exists = checkImportPath(importPath, file)

        if (exists) {
          console.log(`  ✅ ${importPath}`)
        } else {
          console.log(`  ❌ ${importPath} - NOT FOUND`)
          hasErrors = true
        }
      }
    }

    console.log("")
  } catch (error) {
    console.log(`  ❌ Error reading file: ${error.message}`)
    hasErrors = true
  }
}

if (hasErrors) {
  console.log("❌ Import errors found - build may fail")
  process.exit(1)
} else {
  console.log("✅ All imports resolved successfully")
}
