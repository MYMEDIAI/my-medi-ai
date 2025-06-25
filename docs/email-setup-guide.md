# Email Authentication Setup Guide for Medi.AI

## Recommended Email Service Providers

### 1. **Resend** (Recommended for startups)
- **Pros**: Developer-friendly, great deliverability, affordable
- **Pricing**: 3,000 emails/month free, then $20/month
- **Setup**: 
  \`\`\`bash
  npm install resend
  \`\`\`
  Add to `.env`:
  \`\`\`
  RESEND_API_KEY=your_resend_api_key
  \`\`\`

### 2. **SendGrid** (Enterprise-grade)
- **Pros**: Excellent deliverability, advanced analytics
- **Pricing**: 100 emails/day free, then $19.95/month
- **Setup**:
  \`\`\`bash
  npm install @sendgrid/mail
  \`\`\`
  Add to `.env`:
  \`\`\`
  SENDGRID_API_KEY=your_sendgrid_api_key
  \`\`\`

### 3. **Mailgun** (Developer favorite)
- **Pros**: Powerful API, good for transactional emails
- **Pricing**: 5,000 emails/month free for 3 months
- **Setup**:
  Add to `.env`:
  \`\`\`
  MAILGUN_API_KEY=your_mailgun_api_key
  MAILGUN_DOMAIN=your_mailgun_domain
  \`\`\`

### 4. **Postmark** (High deliverability)
- **Pros**: Excellent deliverability rates, fast delivery
- **Pricing**: 100 emails/month free, then $15/month
- **Setup**:
  Add to `.env`:
  \`\`\`
  POSTMARK_API_KEY=your_postmark_api_key
  \`\`\`

## Supabase Email Configuration

### Option 1: Use Supabase Built-in Email (Easiest)
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize the templates with your branding
3. Upload your logo to Supabase Storage
4. Update template HTML with your logo URL

### Option 2: Custom SMTP Provider (Recommended)
1. Go to Supabase Dashboard → Settings → Authentication
2. Enable "Custom SMTP"
3. Configure with your chosen provider:

**For Resend:**
\`\`\`
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Pass: your_resend_api_key
\`\`\`

**For SendGrid:**
\`\`\`
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Pass: your_sendgrid_api_key
\`\`\`

## Email Template Customization Tools

### 1. **MJML** (Recommended)
- Responsive email framework
- Easy to use markup language
- Great for complex layouts

### 2. **React Email**
- Write emails using React components
- TypeScript support
- Preview in browser

### 3. **Maizzle**
- Tailwind CSS for emails
- Build process for email optimization
- Great for developers familiar with Tailwind

### 4. **Stripo**
- Drag-and-drop email builder
- No coding required
- Export to HTML

## Implementation Steps

1. **Choose your email provider** (Resend recommended for Medi.AI)
2. **Set up API keys** in your environment variables
3. **Configure Supabase** to use custom SMTP
4. **Customize email templates** with your Medi.AI branding
5. **Test email delivery** in development and production

## Testing Email Templates

Use these tools to test your emails:
- **Litmus**: Email testing across clients
- **Email on Acid**: Comprehensive email testing
- **Mail Tester**: Check spam score
- **Mailtrap**: Email testing in development

## HIPAA Compliance for Healthcare Emails

- Use encrypted email providers
- Include proper disclaimers
- Implement email retention policies
- Use secure email gateways for PHI
- Consider using patient portals for sensitive communications

## Monitoring and Analytics

Track these metrics:
- Delivery rate
- Open rate
- Click-through rate
- Bounce rate
- Spam complaints

Most providers offer built-in analytics dashboards.
\`\`\`

Let's also create a simple email preview component for testing:
