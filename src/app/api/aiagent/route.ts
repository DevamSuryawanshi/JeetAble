import { NextRequest, NextResponse } from 'next/server'

interface AIRequest {
  message: string
  language: string
  targetLanguage: string
}

interface AIResponse {
  message: string
  action?: 'navigate' | 'speak' | 'help'
  route?: string
  error?: string
}

// Mock translation function - Replace with actual translation API
async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  // For demo purposes, return the original text
  // In production, integrate with Google Translate API or AWS Translate
  
  if (fromLang === toLang) return text
  
  // Mock translations for common phrases
  const translations: { [key: string]: { [key: string]: string } } = {
    'hi': {
      'hello': 'नमस्ते',
      'help': 'मदद',
      'thank you': 'धन्यवाद',
      'goodbye': 'अलविदा'
    },
    'mr': {
      'hello': 'नमस्कार',
      'help': 'मदत',
      'thank you': 'धन्यवाद',
      'goodbye': 'निरोप'
    }
  }
  
  // Simple word replacement for demo
  let translatedText = text.toLowerCase()
  if (translations[toLang]) {
    Object.entries(translations[toLang]).forEach(([english, translated]) => {
      translatedText = translatedText.replace(new RegExp(english, 'gi'), translated)
    })
  }
  
  return translatedText
}

// Intent processing function
function processIntent(message: string): AIResponse {
  const lowerMessage = message.toLowerCase()
  
  // Navigation intents
  if (lowerMessage.includes('open') || lowerMessage.includes('go to') || lowerMessage.includes('navigate')) {
    if (lowerMessage.includes('learning') || lowerMessage.includes('learn')) {
      return {
        message: 'Opening the Learning Hub for you.',
        action: 'navigate',
        route: '/learning'
      }
    }
    if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
      return {
        message: 'Taking you to the Job Portal.',
        action: 'navigate',
        route: '/jobs'
      }
    }
    if (lowerMessage.includes('deaf') || lowerMessage.includes('hearing')) {
      return {
        message: 'Opening Deaf Mode features.',
        action: 'navigate',
        route: '/deaf-mode'
      }
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('emergency')) {
      return {
        message: 'Opening Emergency Help section.',
        action: 'navigate',
        route: '/help'
      }
    }
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('profile')) {
      return {
        message: 'Going to your dashboard.',
        action: 'navigate',
        route: '/dashboard'
      }
    }
    if (lowerMessage.includes('home')) {
      return {
        message: 'Taking you to the homepage.',
        action: 'navigate',
        route: '/'
      }
    }
  }
  
  // Help and information intents
  if (lowerMessage.includes('what can you do') || lowerMessage.includes('help me')) {
    return {
      message: 'I can help you navigate JeetAble, open different sections like Learning Hub, Job Portal, Deaf Mode, and Emergency Help. I can also read content aloud and answer questions about accessibility features. Just ask me to "open learning hub" or "go to jobs" for example.',
      action: 'speak'
    }
  }
  
  if (lowerMessage.includes('accessibility') || lowerMessage.includes('features')) {
    return {
      message: 'JeetAble offers voice navigation, deaf mode with speech-to-text, learning resources, accessible job listings, and emergency help. All features are designed with accessibility in mind including screen reader support, keyboard navigation, and high contrast modes.',
      action: 'speak'
    }
  }
  
  if (lowerMessage.includes('voice') || lowerMessage.includes('speech')) {
    return {
      message: 'Voice features include voice navigation commands, text-to-speech for reading content, and speech-to-text conversion. You can control most of the website using voice commands.',
      action: 'speak'
    }
  }
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      message: 'Hello! Welcome to JeetAble. I\'m here to help you navigate and use all the accessibility features. What would you like to do today?',
      action: 'speak'
    }
  }
  
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return {
      message: 'You\'re welcome! I\'m always here to help make your experience more accessible.',
      action: 'speak'
    }
  }
  
  // Learning specific queries
  if (lowerMessage.includes('learn') || lowerMessage.includes('study') || lowerMessage.includes('education')) {
    return {
      message: 'Our Learning Hub offers sign language tutorials, Braille learning, text-to-speech tools, and accessibility best practices. Would you like me to open the Learning Hub?',
      action: 'speak'
    }
  }
  
  // Job related queries
  if (lowerMessage.includes('job') || lowerMessage.includes('work') || lowerMessage.includes('employment')) {
    return {
      message: 'The Job Portal features disability-friendly job listings with accessibility filters like remote work, wheelchair accessible offices, and flexible hours. Shall I open the Job Portal for you?',
      action: 'speak'
    }
  }
  
  // Emergency queries
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('sos')) {
    return {
      message: 'For emergencies, I can take you to our Emergency Help section which has SOS buttons, emergency contacts, and location-based services. Should I open it now?',
      action: 'navigate',
      route: '/help'
    }
  }
  
  // Default response
  return {
    message: 'I understand you said "' + message + '". I can help you navigate JeetAble, open different sections, or provide information about accessibility features. Try asking me to "open learning hub", "go to jobs", or "what can you do".',
    action: 'speak'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, language, targetLanguage }: AIRequest = await request.json()
    
    if (!message || !message.trim()) {
      return NextResponse.json({
        error: 'Message is required'
      }, { status: 400 })
    }
    
    // Step 1: Translate input to English if needed
    let englishMessage = message
    if (language !== 'en') {
      englishMessage = await translateText(message, language, 'en')
    }
    
    // Step 2: Process the intent
    const response = processIntent(englishMessage)
    
    // Step 3: Translate response back to target language if needed
    let translatedMessage = response.message
    if (targetLanguage !== 'en') {
      translatedMessage = await translateText(response.message, 'en', targetLanguage)
    }
    
    // Step 4: Return the response
    return NextResponse.json({
      ...response,
      message: translatedMessage
    })
    
  } catch (error) {
    console.error('AI Agent API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Sorry, I encountered an error processing your request.'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Agent API is running',
    supportedLanguages: ['en', 'hi', 'mr', 'es', 'fr'],
    actions: ['navigate', 'speak', 'help']
  })
}