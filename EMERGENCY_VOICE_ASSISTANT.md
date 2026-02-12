# Emergency Voice Assistant - Setup Guide

## Overview
Advanced emergency voice assistant for blind and visually impaired users with real-time location tracking and automated alerts.

## Features Implemented

### 1. Emergency Contacts Management
- Store up to 5 emergency contacts per user
- Each contact has: Name, Phone Number, WhatsApp Number
- API endpoints: `/api/emergency-contacts`

### 2. Voice Commands (Web Speech API)
Recognizes:
- "Emergency" - Sends alerts to all contacts
- "Send help" - Same as emergency
- "Call ambulance" - Calls 108 and sends location

### 3. Real-Time Location
- Uses `navigator.geolocation.getCurrentPosition()`
- Gets latitude, longitude
- Generates Google Maps link: `https://www.google.com/maps?q=LAT,LONG`

### 4. Emergency Actions
- Gets real-time location
- Sends SMS to all 5 contacts
- Sends WhatsApp messages to all contacts
- Message format includes location link

### 5. SMS + WhatsApp Integration
- Twilio API for SMS
- Twilio WhatsApp API
- Secure API key handling
- Asynchronous message sending

### 6. Navigation Guidance
- Opens Google Maps navigation to nearest hospital
- Automatic after alert sent

### 7. Speech Feedback
- "Emergency message sent"
- "Calling ambulance"
- "Location shared successfully"
- Error messages with voice

### 8. Safety Features
- Confirmation before sending: "Do you want to send emergency alert? Say yes to confirm"
- GPS error handling
- Network retry logic

## Setup Instructions

### 1. Install Dependencies
```bash
npm install twilio mongoose
```

### 2. Configure Twilio
1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Get a Twilio phone number
4. Enable WhatsApp sandbox: https://www.twilio.com/console/sms/whatsapp/sandbox

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Twilio credentials:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### 4. MongoDB Setup (Optional)
If using MongoDB:
```bash
MONGODB_URI=mongodb://localhost:27017/jeetable
```

### 5. Test Emergency Contacts
Add test contacts via API:
```bash
curl -X POST http://localhost:3000/api/emergency-contacts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo-user",
    "contacts": [
      {
        "name": "John Doe",
        "phoneNumber": "+911234567890",
        "whatsappNumber": "+911234567890"
      }
    ]
  }'
```

## Usage

### Voice Commands
1. **Emergency Alert**
   - Say: "Emergency"
   - System asks: "Do you want to send emergency alert? Say yes to confirm"
   - Say: "Yes"
   - System sends SMS + WhatsApp to all contacts with location

2. **Send Help**
   - Say: "Send help"
   - Same as emergency alert

3. **Call Ambulance**
   - Say: "Call ambulance"
   - System sends location to contacts
   - Automatically calls 108 (India ambulance)

## API Endpoints

### Save Emergency Contacts
```
POST /api/emergency-contacts
Body: {
  "userId": "string",
  "contacts": [
    {
      "name": "string",
      "phoneNumber": "string",
      "whatsappNumber": "string"
    }
  ]
}
```

### Get Emergency Contacts
```
GET /api/emergency-contacts?userId=demo-user
```

### Send Emergency Alert
```
POST /api/emergency-alert
Body: {
  "userId": "string",
  "latitude": number,
  "longitude": number,
  "contacts": []
}
```

## File Structure
```
src/
├── components/
│   └── EmergencyVoiceAssistant.tsx  # Main voice assistant
├── app/api/
│   ├── emergency-contacts/
│   │   └── route.ts                 # Contact management
│   └── emergency-alert/
│       └── route.ts                 # Alert sending
├── lib/
│   └── twilioService.ts             # Twilio integration
└── models/
    └── EmergencyContact.ts          # MongoDB schema
```

## Security Best Practices
1. Never commit `.env.local` to git
2. Use environment variables for all secrets
3. Validate all user inputs
4. Rate limit emergency alerts
5. Log all emergency actions
6. Encrypt sensitive data in database

## Testing
1. Test with browser console open
2. Allow microphone and location permissions
3. Say voice commands clearly
4. Check Twilio logs for message delivery
5. Verify location accuracy

## Troubleshooting

### Voice not recognized
- Check microphone permissions
- Speak clearly and slowly
- Use Chrome/Edge (best support)

### Location not working
- Enable location in browser settings
- Allow location permission for site
- Check GPS is enabled on device

### Messages not sending
- Verify Twilio credentials
- Check phone number format (+country code)
- Verify WhatsApp sandbox setup
- Check Twilio account balance

## Production Deployment
1. Set up production MongoDB
2. Configure production Twilio account
3. Add rate limiting
4. Set up monitoring/alerts
5. Test thoroughly with real contacts
6. Add user authentication

## Support
For issues or questions, contact support or check documentation.
