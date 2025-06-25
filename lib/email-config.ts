export const emailConfig = {
  // Custom email templates for Supabase
  templates: {
    confirmation: {
      subject: "Welcome to Medi.AI - Verify Your Email",
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`,
    },
    recovery: {
      subject: "Reset Your Medi.AI Password",
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    },
    emailChange: {
      subject: "Confirm Your New Email Address",
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`,
    },
  },

  // Email styling
  branding: {
    logoUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/images/medi-ai-logo.png`,
    primaryColor: "#2563eb",
    backgroundColor: "#f8fafc",
    textColor: "#1f2937",
  },
}

export const getEmailTemplate = (type: "confirmation" | "recovery" | "emailChange") => {
  return emailConfig.templates[type]
}
