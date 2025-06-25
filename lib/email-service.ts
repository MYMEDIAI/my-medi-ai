import { generateEmailHtml } from "./email-templates"

interface EmailData {
  to: string
  firstName: string
  verificationUrl?: string
  resetUrl?: string
  dashboardUrl?: string
}

export class EmailService {
  private apiKey: string
  private provider: "resend" | "sendgrid" | "mailgun" | "postmark"

  constructor(provider: "resend" | "sendgrid" | "mailgun" | "postmark" = "resend") {
    this.provider = provider
    this.apiKey = this.getApiKey()
  }

  private getApiKey(): string {
    switch (this.provider) {
      case "resend":
        return process.env.RESEND_API_KEY || ""
      case "sendgrid":
        return process.env.SENDGRID_API_KEY || ""
      case "mailgun":
        return process.env.MAILGUN_API_KEY || ""
      case "postmark":
        return process.env.POSTMARK_API_KEY || ""
      default:
        return ""
    }
  }

  async sendVerificationEmail(data: EmailData): Promise<boolean> {
    const html = generateEmailHtml("emailVerification", data, "Verify Your Medi.AI Account")

    return this.sendEmail({
      to: data.to,
      subject: "Welcome to Medi.AI - Verify Your Email 🎉",
      html,
    })
  }

  async sendPasswordResetEmail(data: EmailData): Promise<boolean> {
    const html = generateEmailHtml("passwordReset", data, "Reset Your Medi.AI Password")

    return this.sendEmail({
      to: data.to,
      subject: "Reset Your Medi.AI Password 🔐",
      html,
    })
  }

  async sendWelcomeEmail(data: EmailData): Promise<boolean> {
    const html = generateEmailHtml("welcome", data, "Welcome to Medi.AI!")

    return this.sendEmail({
      to: data.to,
      subject: "Welcome to Medi.AI! Your account is ready 🚀",
      html,
    })
  }

  private async sendEmail(emailData: {
    to: string
    subject: string
    html: string
  }): Promise<boolean> {
    try {
      switch (this.provider) {
        case "resend":
          return this.sendWithResend(emailData)
        case "sendgrid":
          return this.sendWithSendGrid(emailData)
        case "mailgun":
          return this.sendWithMailgun(emailData)
        case "postmark":
          return this.sendWithPostmark(emailData)
        default:
          console.error("Unsupported email provider")
          return false
      }
    } catch (error) {
      console.error("Email sending failed:", error)
      return false
    }
  }

  private async sendWithResend(emailData: {
    to: string
    subject: string
    html: string
  }): Promise<boolean> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        from: "Medi.AI <noreply@medi.ai>",
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
      }),
    })

    return response.ok
  }

  private async sendWithSendGrid(emailData: {
    to: string
    subject: string
    html: string
  }): Promise<boolean> {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: emailData.to }],
            subject: emailData.subject,
          },
        ],
        from: { email: "noreply@medi.ai", name: "Medi.AI" },
        content: [
          {
            type: "text/html",
            value: emailData.html,
          },
        ],
      }),
    })

    return response.ok
  }

  private async sendWithMailgun(emailData: {
    to: string
    subject: string
    html: string
  }): Promise<boolean> {
    const domain = process.env.MAILGUN_DOMAIN || ""
    const formData = new FormData()
    formData.append("from", "Medi.AI <noreply@medi.ai>")
    formData.append("to", emailData.to)
    formData.append("subject", emailData.subject)
    formData.append("html", emailData.html)

    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString("base64")}`,
      },
      body: formData,
    })

    return response.ok
  }

  private async sendWithPostmark(emailData: {
    to: string
    subject: string
    html: string
  }): Promise<boolean> {
    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": this.apiKey,
      },
      body: JSON.stringify({
        From: "noreply@medi.ai",
        To: emailData.to,
        Subject: emailData.subject,
        HtmlBody: emailData.html,
      }),
    })

    return response.ok
  }
}

// Export a default instance
export const emailService = new EmailService()
