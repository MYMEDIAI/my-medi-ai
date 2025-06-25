#!/bin/bash

echo "🚀 Medi.AI Email Service Quick Setup"
echo "===================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed."
echo "📦 Installing dependencies..."

cd frontend && npm install
cd ../backend && npm install

echo "✅ Setup complete!"
