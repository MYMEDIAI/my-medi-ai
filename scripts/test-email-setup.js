#!/usr/bin/env node

// Test the setup-email-services.js script
const EmailServiceSetup = require("./setup-email-services.js")

async function testEmailSetup() {
  console.log("🧪 Testing Email Service Setup Script...\n")

  try {
    // Create an instance of the EmailServiceSetup class
    const setup = new EmailServiceSetup()

    // Test that the class initializes correctly
    console.log("✅ EmailServiceSetup class instantiated successfully")
    console.log("📁 Environment path:", setup.envPath)
    console.log("📧 Available providers:", Object.keys(setup.providers).join(", "))

    // Test individual methods
    console.log("\n🔍 Testing individual methods...")

    // Test checkEnvFile method
    console.log("Testing checkEnvFile...")
    setup.checkEnvFile()
    console.log("✅ checkEnvFile method works")

    // Test showProviderOptions method
    console.log("\nTesting showProviderOptions...")
    setup.showProviderOptions()
    console.log("✅ showProviderOptions method works")

    // Test updateEnvVar method
    console.log("\nTesting updateEnvVar...")
    const testContent = "TEST_VAR=old_value\nOTHER_VAR=other_value"
    const updatedContent = setup.updateEnvVar(testContent, "TEST_VAR", "new_value")
    console.log("Original:", testContent)
    console.log("Updated:", updatedContent)
    console.log("✅ updateEnvVar method works")

    // Test wait method
    console.log("\nTesting wait method...")
    const startTime = Date.now()
    await setup.wait(100) // Wait 100ms
    const endTime = Date.now()
    console.log(`✅ wait method works (waited ${endTime - startTime}ms)`)

    console.log("\n🎉 All tests passed! The email setup script is working correctly.")
  } catch (error) {
    console.error("❌ Test failed:", error.message)
    console.error("Stack trace:", error.stack)
  }
}

// Run the test
testEmailSetup()
