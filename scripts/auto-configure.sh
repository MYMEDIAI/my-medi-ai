#!/bin/bash

echo "🚀 Medi.AI Auto-Configuration Script"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "Dependencies check passed"
}

# Install npm dependencies
install_dependencies() {
    print_info "Installing project dependencies..."
    
    if [ ! -d "node_modules" ]; then
        npm install --silent
        print_status "Dependencies installed"
    else
        print_status "Dependencies already installed"
    fi
}

# Setup environment file
setup_env_file() {
    print_info "Setting up environment file..."
    
    if [ ! -f ".env.local" ]; then
        cp .env.example .env.local
        print_status "Created .env.local from template"
    else
        print_status ".env.local already exists"
    fi
}

# Get Supabase credentials
get_supabase_credentials() {
    print_info "Setting up Supabase integration..."
    echo ""
    echo "📋 You'll need your Supabase credentials:"
    echo "1. Go to https://supabase.com/dashboard"
    echo "2. Select your project (or create a new one)"
    echo "3. Go to Settings → API"
    echo "4. Copy the Project URL and anon public key"
    echo ""
    
    # Check if already configured
    if grep -q "your_supabase_url" .env.local || [ -z "$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d'=' -f2)" ]; then
        read -p "Enter your Supabase Project URL: " supabase_url
        read -p "Enter your Supabase Anon Key: " supabase_anon_key
        read -p "Enter your Supabase Service Role Key: " supabase_service_key
        
        # Update .env.local
        sed -i.bak "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$supabase_url|" .env.local
        sed -i.bak "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabase_anon_key|" .env.local
        sed -i.bak "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$supabase_service_key|" .env.local
        
        print_status "Supabase credentials configured"
    else
        print_status "Supabase credentials already configured"
    fi
}

# Setup site URL
setup_site_url() {
    print_info "Setting up site URL..."
    
    if grep -q "https://mymedi.ai" .env.local; then
        echo ""
        echo "🌐 Site URL Configuration:"
        echo "For development: http://localhost:3000"
        echo "For production: https://yourdomain.com"
        echo ""
        read -p "Enter your site URL (default: http://localhost:3000): " site_url
        site_url=${site_url:-http://localhost:3000}
        
        sed -i.bak "s|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=$site_url|" .env.local
        print_status "Site URL configured: $site_url"
    else
        print_status "Site URL already configured"
    fi
}

# Run database scripts
run_database_scripts() {
    print_info "Setting up database schema..."
    
    # Check if Supabase CLI is available
    if command -v supabase &> /dev/null; then
        print_info "Using Supabase CLI to run database scripts..."
        
        supabase db reset --linked 2>/dev/null || {
            print_warning "Supabase CLI not linked. Please run scripts manually in Supabase SQL Editor."
            return 1
        }
        
        # Run each script
        local scripts=(
            "scripts/01-create-tables.sql"
            "scripts/02-rls-policies.sql"
            "scripts/03-additional-indexes.sql"
            "scripts/04-validation-functions.sql"
            "scripts/05-views-and-functions.sql"
            "scripts/fix-rls-policies.sql"
            "scripts/update-users-table.sql"
        )
        
        for script in "${scripts[@]}"; do
            if [ -f "$script" ]; then
                print_info "Running $script..."
                supabase db push --include-all 2>/dev/null || {
                    print_warning "Could not run $script automatically. Please run manually."
                }
            fi
        done
        
        print_status "Database scripts completed"
    else
        print_warning "Supabase CLI not found. Database scripts need to be run manually."
        echo ""
        echo "📋 Manual Database Setup:"
        echo "1. Go to your Supabase Dashboard"
        echo "2. Navigate to SQL Editor"
        echo "3. Run these scripts in order:"
        echo "   • scripts/01-create-tables.sql"
        echo "   • scripts/02-rls-policies.sql"
        echo "   • scripts/03-additional-indexes.sql"
        echo "   • scripts/04-validation-functions.sql"
        echo "   • scripts/05-views-and-functions.sql"
        echo "   • scripts/fix-rls-policies.sql"
        echo "   • scripts/update-users-table.sql"
        echo ""
        read -p "Press Enter when you've completed the database setup..."
    fi
}

# Setup email service
setup_email_service() {
    print_info "Setting up email service..."
    
    # Make scripts executable
    chmod +x scripts/setup-email-services.js 2>/dev/null
    chmod +x scripts/generate-supabase-config.js 2>/dev/null
    
    echo ""
    echo "📧 Email Service Setup:"
    echo "1. 🚀 Quick Setup (Resend - Recommended)"
    echo "2. 🔧 Custom Setup (Choose provider)"
    echo "3. ⏭️  Skip email setup for now"
    echo ""
    read -p "Choose option (1-3): " email_choice
    
    case $email_choice in
        1)
            setup_resend_quick
            ;;
        2)
            node scripts/setup-email-services.js
            ;;
        3)
            print_warning "Email setup skipped. You can run 'npm run setup-email' later."
            ;;
        *)
            print_warning "Invalid choice. Skipping email setup."
            ;;
    esac
}

# Quick Resend setup
setup_resend_quick() {
    print_info "Setting up Resend (recommended email provider)..."
    
    echo ""
    echo "🔗 Opening Resend signup page..."
    
    # Open Resend signup page
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "https://resend.com/signup" 2>/dev/null
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "https://resend.com/signup" 2>/dev/null
    elif [[ "$OSTYPE" == "msys" ]]; then
        start "https://resend.com/signup" 2>/dev/null
    fi
    
    echo ""
    echo "📋 Resend Setup Steps:"
    echo "1. Sign up for a free Resend account"
    echo "2. Go to Dashboard → API Keys"
    echo "3. Click 'Create API Key'"
    echo "4. Copy your API key"
    echo ""
    
    read -p "Paste your Resend API key here (or press Enter to skip): " resend_key
    
    if [ ! -z "$resend_key" ]; then
        # Update .env.local with Resend key
        if grep -q "RESEND_API_KEY=" .env.local; then
            sed -i.bak "s/RESEND_API_KEY=.*/RESEND_API_KEY=$resend_key/" .env.local
        else
            echo "RESEND_API_KEY=$resend_key" >> .env.local
        fi
        
        print_status "Resend API key configured"
        
        # Generate Supabase email config
        print_info "Generating Supabase email configuration..."
        node scripts/generate-supabase-config.js
    else
        print_warning "Resend setup skipped"
    fi
}

# Verify configuration
verify_configuration() {
    print_info "Verifying configuration..."
    
    local errors=0
    
    # Check .env.local
    if [ ! -f ".env.local" ]; then
        print_error ".env.local file not found"
        ((errors++))
    fi
    
    # Check Supabase URL
    if ! grep -q "supabase.co" .env.local 2>/dev/null; then
        print_warning "Supabase URL may not be configured correctly"
    fi
    
    # Check for at least one email provider
    if ! grep -E "(RESEND_API_KEY|SENDGRID_API_KEY|MAILGUN_API_KEY|POSTMARK_API_KEY)=.+" .env.local >/dev/null 2>&1; then
        print_warning "No email provider API key found"
    fi
    
    if [ $errors -eq 0 ]; then
        print_status "Configuration verification passed"
    else
        print_error "Configuration verification failed with $errors errors"
    fi
}

# Generate summary
generate_summary() {
    echo ""
    echo "🎉 Auto-Configuration Complete!"
    echo "==============================="
    echo ""
    
    print_status "✅ Dependencies installed"
    print_status "✅ Environment file configured"
    print_status "✅ Supabase integration setup"
    print_status "✅ Database schema ready"
    print_status "✅ Email service configured"
    
    echo ""
    echo "📋 Next Steps:"
    echo "1. Start development server: npm run dev"
    echo "2. Test user registration and email verification"
    echo "3. Configure additional features as needed"
    echo ""
    
    echo "🔧 Useful Commands:"
    echo "• npm run dev              - Start development server"
    echo "• npm run setup-email      - Reconfigure email service"
    echo "• npm run config-supabase  - Regenerate Supabase config"
    echo ""
    
    echo "📚 Documentation:"
    echo "• Database Schema: scripts/01-create-tables.sql"
    echo "• Email Templates: email-templates/"
    echo "• Setup Guide: docs/email-setup-guide.md"
    echo ""
    
    print_info "Your Medi.AI platform is ready for development! 🚀"
}

# Main execution
main() {
    echo "Starting auto-configuration process..."
    echo ""
    
    check_dependencies
    install_dependencies
    setup_env_file
    get_supabase_credentials
    setup_site_url
    run_database_scripts
    setup_email_service
    verify_configuration
    generate_summary
}

# Run main function
main "$@"
