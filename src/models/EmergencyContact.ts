import mongoose from 'mongoose'

const EmergencyContactSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  contacts: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^[+]?[\d\s-()]+$/.test(v)
        },
        message: 'Invalid phone number format'
      }
    },
    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^[+]?[\d\s-()]+$/.test(v)
        },
        message: 'Invalid WhatsApp number format'
      }
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Limit to 5 contacts per user
EmergencyContactSchema.pre('save', function(next) {
  if (this.contacts.length > 5) {
    next(new Error('Maximum 5 emergency contacts allowed'))
  } else {
    next()
  }
})

export default mongoose.models.EmergencyContact || mongoose.model('EmergencyContact', EmergencyContactSchema)
