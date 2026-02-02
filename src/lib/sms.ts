import twilio from 'twilio'

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

export async function sendSMS(to: string, message: string): Promise<boolean> {
  if (!client) {
    console.warn('Twilio not configured, skipping SMS')
    return false
  }

  if (!process.env.TWILIO_PHONE_NUMBER) {
    console.warn('TWILIO_PHONE_NUMBER not configured, skipping SMS')
    return false
  }

  try {
    // Clean and format phone number
    let formattedPhone = to.replace(/\D/g, '')
    if (!formattedPhone.startsWith('1') && formattedPhone.length === 10) {
      formattedPhone = '1' + formattedPhone
    }
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone
    }

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    })

    console.log(`SMS sent successfully to ${formattedPhone}`)
    return true
  } catch (error) {
    console.error('Failed to send SMS:', error)
    return false
  }
}

export async function sendConfirmationSMS(
  phone: string,
  customerName: string,
  planName: string,
  amount: string
): Promise<boolean> {
  const message = `Hi ${customerName}! 🎉 Your BetterWeb ${planName} plan purchase of ${amount} is confirmed. Our team will contact you within 24 hours to start your project. Questions? Reply to this text or email support@betterweb.pro`

  return sendSMS(phone, message)
}
