import sgMail from '@sendgrid/mail'

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not configured, skipping email')
    return false
  }

  try {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'support@betterweb.pro'
    const fromName = process.env.SENDGRID_FROM_NAME || 'Better Web Support'
    
    await sgMail.send({
      to: data.to,
      from: {
        email: fromEmail,
        name: fromName,
      },
      bcc: 'alan.zou@gmail.com',
      subject: data.subject,
      html: data.html,
      text: data.text || data.html.replace(/<[^>]*>/g, ''),
    })
    console.log(`Email sent successfully to ${data.to}`)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export async function sendConfirmationEmail(
  email: string,
  customerName: string,
  planName: string,
  amount: string,
  receiptUrl?: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050510;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #00d4ff; font-size: 28px; margin: 0;">BetterWeb</h1>
        </div>
        
        <!-- Main Content -->
        <div style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px;">
          <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0;">Payment Confirmed! 🎉</h2>
          
          <p style="color: #a0a0b0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Hi ${customerName},
          </p>
          
          <p style="color: #a0a0b0; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Thank you for your purchase! Your ${planName} plan is now active.
          </p>
          
          <!-- Order Summary -->
          <div style="background: rgba(0, 212, 255, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #00d4ff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #a0a0b0;">Plan</span>
              <span style="color: #ffffff; font-weight: 600;">${planName}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #a0a0b0;">Amount</span>
              <span style="color: #00ff88; font-weight: 600;">${amount}</span>
            </div>
          </div>
          
          ${receiptUrl ? `
          <a href="${receiptUrl}" style="display: inline-block; background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%); color: #050510; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
            View Receipt
          </a>
          ` : ''}
          
          <p style="color: #a0a0b0; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
            Our team will reach out to you within 24 hours to begin your project. If you have any questions, reply to this email.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px;">
          <p style="color: #606070; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} BetterWeb. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Payment Confirmed - ${planName} Plan`,
    html,
  })
}
