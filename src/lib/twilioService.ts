// Twilio SMS and WhatsApp Service
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER

let client: any = null

// Initialize Twilio client
if (accountSid && authToken) {
  client = twilio(accountSid, authToken)
}

interface EmergencyContact {
  name: string
  phoneNumber: string
  whatsappNumber: string
}

interface LocationData {
  latitude: number
  longitude: number
  mapsLink: string
}

/**
 * Send SMS to emergency contact
 */
export async function sendEmergencySMS(
  contact: EmergencyContact,
  location: LocationData
): Promise<{ success: boolean; error?: string }> {
  if (!client) {
    return { success: false, error: 'Twilio not configured' }
  }

  try {
    const message = `🚨 EMERGENCY ALERT from JeetAble user.

I need immediate help!

My current location:
${location.mapsLink}

Latitude: ${location.latitude}
Longitude: ${location.longitude}

Please respond immediately.

- Sent from JeetAble Emergency System`

    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: contact.phoneNumber
    })

    return { success: true }
  } catch (error: any) {
    console.error('SMS Error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send WhatsApp message to emergency contact
 */
export async function sendEmergencyWhatsApp(
  contact: EmergencyContact,
  location: LocationData
): Promise<{ success: boolean; error?: string }> {
  if (!client) {
    return { success: false, error: 'Twilio not configured' }
  }

  try {
    const message = `🚨 *EMERGENCY ALERT* from JeetAble user

I need immediate help!

📍 *My current location:*
${location.mapsLink}

Coordinates:
Lat: ${location.latitude}
Long: ${location.longitude}

⚠️ Please respond immediately.

_Sent from JeetAble Emergency System_`

    await client.messages.create({
      body: message,
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: `whatsapp:${contact.whatsappNumber}`
    })

    return { success: true }
  } catch (error: any) {
    console.error('WhatsApp Error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send emergency alerts to all contacts
 */
export async function sendEmergencyAlerts(
  contacts: EmergencyContact[],
  location: LocationData
): Promise<{
  success: boolean
  smsResults: any[]
  whatsappResults: any[]
  errors: string[]
}> {
  const smsResults: any[] = []
  const whatsappResults: any[] = []
  const errors: string[] = []

  // Send SMS to all contacts
  const smsPromises = contacts.map(async (contact) => {
    const result = await sendEmergencySMS(contact, location)
    smsResults.push({ contact: contact.name, ...result })
    if (!result.success && result.error) {
      errors.push(`SMS to ${contact.name}: ${result.error}`)
    }
    return result
  })

  // Send WhatsApp to all contacts
  const whatsappPromises = contacts.map(async (contact) => {
    const result = await sendEmergencyWhatsApp(contact, location)
    whatsappResults.push({ contact: contact.name, ...result })
    if (!result.success && result.error) {
      errors.push(`WhatsApp to ${contact.name}: ${result.error}`)
    }
    return result
  })

  // Execute all promises
  await Promise.allSettled([...smsPromises, ...whatsappPromises])

  const success = smsResults.some(r => r.success) || whatsappResults.some(r => r.success)

  return {
    success,
    smsResults,
    whatsappResults,
    errors
  }
}
