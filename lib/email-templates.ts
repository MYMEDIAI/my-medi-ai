import { getLogoUrl, createPlaceholderLogo } from "./image-utils"

export const emailTemplates = {
  // Base template with your branding
  baseTemplate: (content: string, title: string) => {
    const logoUrl = getLogoUrl()
    const placeholderLogo = createPlaceholderLogo()

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #374151;
                background-color: #f8fafc;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
                padding: 40px 20px;
                text-align: center;
            }
            .logo {
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                background-color: white;
                border-radius: 16px;
                padding: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .logo img {
                max-width: 60px;
                max-height: 60px;
                object-fit: contain;
            }
            .header h1 {
                color: white;
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }
            .content {
                padding: 40px 30px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                transition: all 0.2s ease;
            }
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
            }
            .footer {
                background-color: #f9fafb;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            .footer p {
                margin: 0;
                color: #6b7280;
                font-size: 14px;
            }
            .security-notice {
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 16px;
                margin: 20px 0;
            }
            .security-notice p {
                margin: 0;
                color: #92400e;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="${logoUrl}" 
                         alt="Medi.AI Logo" 
                         width="60" 
                         height="60"
                         onerror="this.src='${placeholderLogo}'">
                </div>
                <h1>Medi.AI</h1>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p>© 2024 Medi.AI. All rights reserved.</p>
                <p>Secure healthcare platform powered by AI</p>
                <p style="margin-top: 10px; font-size: 12px;">
                    This email was sent to you because you have an account with Medi.AI.
                    <br>If you didn't request this email, please ignore it.
                </p>
            </div>
        </div>
    </body>
    </html>
  `
  },

  // Email verification template
  emailVerification: (verificationUrl: string, firstName: string) => `
    <h2>Welcome to Medi.AI, ${firstName}! 🎉</h2>
    <p>Thank you for joining our secure healthcare platform. We're excited to help you manage your health with the power of AI.</p>
    
    <p>To get started, please verify your email address by clicking the button below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
    </div>
    
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationUrl}</p>
    
    <div class="security-notice">
        <p><strong>Security Notice:</strong> This verification link will expire in 24 hours for your security. If you didn't create an account with Medi.AI, please ignore this email.</p>
    </div>
    
    <h3>What's Next?</h3>
    <ul>
        <li>Complete your health profile</li>
        <li>Upload your medical records</li>
        <li>Start chatting with our AI health assistant</li>
        <li>Connect with healthcare providers</li>
    </ul>
    
    <p>If you have any questions, our support team is here to help at <a href="mailto:support@medi.ai">support@medi.ai</a></p>
    
    <p>Best regards,<br>The Medi.AI Team</p>
  `,

  // Password reset template
  passwordReset: (resetUrl: string, firstName: string) => `
    <h2>Password Reset Request</h2>
    <p>Hi ${firstName},</p>
    
    <p>We received a request to reset your password for your Medi.AI account. If you made this request, click the button below to reset your password:</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
    
    <div class="security-notice">
        <p><strong>Security Notice:</strong> This password reset link will expire in 1 hour for your security. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
    </div>
    
    <h3>Security Tips:</h3>
    <ul>
        <li>Use a strong, unique password</li>
        <li>Enable two-factor authentication</li>
        <li>Never share your login credentials</li>
        <li>Log out from shared devices</li>
    </ul>
    
    <p>If you continue to have problems, please contact our support team at <a href="mailto:support@medi.ai">support@medi.ai</a></p>
    
    <p>Best regards,<br>The Medi.AI Security Team</p>
  `,

  // Welcome email after verification
  welcome: (firstName: string, dashboardUrl: string) => `
    <h2>Welcome to Medi.AI! Your account is now active 🚀</h2>
    <p>Hi ${firstName},</p>
    
    <p>Congratulations! Your email has been verified and your Medi.AI account is now fully active. You're ready to start your journey towards better health management with AI.</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
    </div>
    
    <h3>Get Started with These Features:</h3>
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #8b5cf6;">🤖 AI Health Assistant</h4>
        <p>Chat with our AI to get personalized health insights and recommendations.</p>
        
        <h4 style="color: #8b5cf6;">📋 Health Records</h4>
        <p>Securely upload and organize your medical documents with OCR technology.</p>
        
        <h4 style="color: #8b5cf6;">📊 Vitals Tracking</h4>
        <p>Monitor your health metrics and track progress over time.</p>
        
        <h4 style="color: #8b5cf6;">👨‍⚕️ Provider Network</h4>
        <p>Connect with healthcare professionals and share data securely.</p>
    </div>
    
    <h3>Your Privacy & Security</h3>
    <p>Your health data is protected with enterprise-grade security and HIPAA compliance. We never share your personal information without your explicit consent.</p>
    
    <p>Need help getting started? Check out our <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/help">Help Center</a> or contact us at <a href="mailto:support@medi.ai">support@medi.ai</a></p>
    
    <p>Welcome aboard!<br>The Medi.AI Team</p>
  `,
}

export const generateEmailHtml = (template: keyof typeof emailTemplates, data: any, title: string): string => {
  let content = ""

  switch (template) {
    case "emailVerification":
      content = emailTemplates.emailVerification(data.verificationUrl, data.firstName)
      break
    case "passwordReset":
      content = emailTemplates.passwordReset(data.resetUrl, data.firstName)
      break
    case "welcome":
      content = emailTemplates.welcome(data.firstName, data.dashboardUrl)
      break
    default:
      content = "<p>Email template not found</p>"
  }

  return emailTemplates.baseTemplate(content, title)
}
