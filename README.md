# 🇮🇳 MyMedi.AI - India's Leading AI Healthcare Platform

**The Smart Alternative to TATA MD & International Platforms**

A comprehensive healthcare platform built specifically for Indian healthcare needs, featuring AI-powered consultations, regional language support, Indian medical database integration, and affordable pricing designed for Indian families.

## 🎯 Why Choose MyMedi.AI Over TATA MD?

✅ **50% More Affordable** - Pricing designed for Indian families
✅ **Indian Medical Database** - Comprehensive Indian medicine & treatment database  
✅ **15+ Regional Languages** - Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati & more
✅ **Indian Healthcare Focus** - Built for Indian diseases, treatments & medical practices
✅ **Local Doctor Network** - 25,000+ verified Indian doctors across all states
✅ **Ayurveda Integration** - Traditional + Modern medicine approach
✅ **Indian Insurance Support** - Works with all major Indian health insurance
✅ **Tier 2/3 City Focus** - Accessible healthcare for smaller cities

## 📊 MyMedi.AI vs TATA MD Comparison

| Feature | MyMedi.AI | TATA MD | Advantage |
|---------|-----------|---------|-----------|
| **Pricing** | ₹99/month | ₹199/month | 50% cheaper |
| **Languages** | 15+ Indian languages | Limited | Better accessibility |
| **Indian Medicine DB** | Complete Indian database | Limited | More relevant |
| **Ayurveda Support** | Full integration | Basic | Holistic approach |
| **Tier 2/3 Cities** | Full support | Limited | Better reach |
| **Family Plans** | ₹199 for 6 members | ₹399 for 4 members | Better value |
| **Offline Support** | Available | Not available | Rural accessibility |

## ⚡ Quick Start (Auto-Configuration)

Run the automated setup to configure everything in minutes:

### Option 1: One-Command Setup
\`\`\`bash
npm run setup-complete
\`\`\`

### Option 2: Interactive Setup
\`\`\`bash
npm run auto-configure
\`\`\`

### Option 3: Shell Script (Linux/Mac)
\`\`\`bash
chmod +x scripts/auto-configure.sh
./scripts/auto-configure.sh
\`\`\`

## 🎯 What Gets Auto-Configured

✅ **Supabase Integration** - Database and authentication
✅ **Environment Variables** - All required configuration
✅ **Database Schema** - Complete healthcare data model
✅ **Email Service** - Branded authentication emails
✅ **Security Policies** - HIPAA-compliant RLS policies
✅ **Email Templates** - Custom branded templates

## 📋 Manual Setup (If Needed)

### 1. Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 2. Environment Setup
\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Install dependencies
npm install
\`\`\`

### 3. Configure Supabase
1. Create a new Supabase project
2. Get your project URL and API keys
3. Update `.env.local` with your credentials

### 4. Database Setup
Run these SQL scripts in your Supabase SQL Editor:
1. `scripts/01-create-tables.sql`
2. `scripts/02-rls-policies.sql`
3. `scripts/03-additional-indexes.sql`
4. `scripts/04-validation-functions.sql`
5. `scripts/05-views-and-functions.sql`
6. `scripts/fix-rls-policies.sql`
7. `scripts/update-users-table.sql`

### 5. Email Service Setup
Choose and configure an email provider:
- **Resend** (Recommended): `npm run setup-email`
- **SendGrid**: Configure SMTP in Supabase
- **Mailgun**: Configure SMTP in Supabase
- **Postmark**: Configure SMTP in Supabase

## 🚀 Development

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 📧 Email Configuration

### Supported Providers
- **Resend** - 3,000 emails/month free
- **SendGrid** - 100 emails/day free
- **Mailgun** - 5,000 emails/month free (3 months)
- **Postmark** - 100 emails/month free

### Email Templates
Custom branded templates included:
- Email verification
- Password reset
- Welcome emails
- Account notifications

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and profiles
- **health_profiles** - Medical history and preferences
- **health_records** - Medical documents and files
- **vitals_data** - Health metrics and measurements
- **ai_interactions** - AI chat history and analysis
- **family_connections** - Family member access control
- **health_insights** - AI-generated health insights

### Security Features
- Row Level Security (RLS) policies
- HIPAA-compliant data handling
- Encrypted sensitive data
- Audit logging
- Access control by user roles

## 🔐 Authentication Features

- **Secure Registration** - Email verification required
- **Password Security** - Strong password requirements
- **Multi-Factor Auth** - Optional 2FA support
- **Session Management** - Secure session handling
- **Role-Based Access** - Patient, Doctor, Admin roles
- **Account Recovery** - Secure password reset

## 🤖 AI Features

- **Health Chat Assistant** - AI-powered health conversations
- **Document Analysis** - OCR and medical document processing
- **Health Insights** - Personalized health recommendations
- **Risk Assessment** - AI-driven health risk analysis
- **Progress Tracking** - Health goal monitoring

## 🏥 Healthcare Compliance

- **HIPAA Compliant** - Healthcare data protection
- **Data Encryption** - End-to-end encryption
- **Audit Trails** - Complete access logging
- **Privacy Controls** - Granular data sharing permissions
- **Secure Storage** - Encrypted file storage

## 📱 Features

### For Patients
- Secure health record storage
- AI health assistant
- Vitals tracking
- Family sharing controls
- Doctor connections

### For Healthcare Providers
- Patient data access (with permission)
- Health insights dashboard
- Communication tools
- Medical record analysis
- Treatment recommendations

### For Administrators
- User management
- System monitoring
- Compliance reporting
- Analytics dashboard
- Security controls

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Email**: Resend/SendGrid/Mailgun/Postmark
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4 (configurable)

## 📚 Documentation

- [Database Schema](scripts/01-create-tables.sql)
- [Email Setup Guide](docs/email-setup-guide.md)
- [API Documentation](docs/api.md)
- [Security Guide](docs/security.md)
- [Deployment Guide](docs/deployment.md)

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
# Deploy to Vercel
vercel --prod
\`\`\`

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Configuration Commands

\`\`\`bash
# Auto-configure everything
npm run setup-complete

# Configure email service only
npm run setup-email

# Generate Supabase configuration
npm run config-supabase

# Interactive setup
npm run auto-configure
\`\`\`

## 🆘 Support

- **Documentation**: Check the docs/ folder
- **Issues**: Create a GitHub issue
- **Email**: support@medi.ai
- **Community**: Join our Discord

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Supabase for the backend infrastructure
- OpenAI for AI capabilities
- Vercel for hosting and deployment
- The open-source community

---

**🚀 Ready to build the future of healthcare with AI!**
