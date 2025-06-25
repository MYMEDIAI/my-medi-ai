#!/bin/bash

echo "🚀 Medi.AI Email Service Quick Setup"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Make scripts executable
chmod +x scripts/setup-email-services.js
chmod +x scripts/generate-supabase-config.js

echo ""
echo "🎯 Choose your setup option:"
echo "1. 🚀 Quick Setup (Recommended - Resend)"
echo "2. 🔧 Custom Setup (Choose your provider)"
echo "3. 📧 Supabase Configuration Only"

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Setting up with Resend (recommended)..."
        echo "Opening Resend signup page..."
        
        # Open Resend signup
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "https://resend.com/signup"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "https://resend.com/signup"
        elif [[ "$OSTYPE" == "msys" ]]; then
            start "https://resend.com/signup"
        fi
        
        echo ""
        echo "📋 Quick Resend Setup Steps:"
        echo "1. Sign up for a free Resend account"
        echo "2. Go to Dashboard → API Keys"
        echo "3. Click 'Create API Key'"
        echo "4. Copy your API key"
        echo ""
        read -p "Paste your Resend API key here: " api_key
        
        # Update .env.local
        if [ ! -f ".env.local" ]; then
            cp .env.example .env.local
        fi
        
        # Update the API key
        if grep -q "RESEND_API_KEY=" .env.local; then
            sed -i.bak "s/RESEND_API_KEY=.*/RESEND_API_KEY=$api_key/" .env.local
        else
            echo "RESEND_API_KEY=$api_key" >> .env.local
        fi
        
        echo "✅ Resend API key saved!"
        ;;
    2)
        echo "🔧 Running custom setup..."
        node scripts/setup-email-services.js
        ;;
    3)
        echo "📧 Generating Supabase configuration..."
        node scripts/generate-supabase-config.js
        ;;
    *)
        echo "❌ Invalid choice. Running default setup..."
        node scripts/setup-email-services.js
        ;;
esac

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure Supabase SMTP settings (run: npm run config-supabase)"
echo "2. Test your email templates"
echo "3. Deploy your application"
echo ""
echo "🔧 Useful commands:"
echo "• npm run setup-email     - Run email service setup"
echo "• npm run config-supabase - Generate Supabase config"
echo "• npm run setup-complete  - Run complete setup"
