import { NextRequest, NextResponse } from 'next/server'

interface Scheme {
  title: string
  description: string
  link: string
  category: string
  ministry: string
  lastUpdated: string
}

// Cache for storing schemes data
let schemesCache: { data: Scheme[], timestamp: number } | null = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Sample government schemes data (in production, this would be scraped from official sources)
const SAMPLE_SCHEMES: Scheme[] = [
  {
    title: 'Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    description: 'World\'s largest health insurance scheme providing coverage of Rs. 5 lakh per family per year for secondary and tertiary care hospitalization.',
    link: 'https://pmjay.gov.in/',
    category: 'Healthcare',
    ministry: 'Ministry of Health and Family Welfare',
    lastUpdated: new Date().toISOString()
  },
  {
    title: 'Accessible India Campaign (Sugamya Bharat Abhiyan)',
    description: 'Nationwide flagship campaign for achieving universal accessibility for persons with disabilities.',
    link: 'https://www.accessibleindia.gov.in/',
    category: 'Disability',
    ministry: 'Department of Empowerment of Persons with Disabilities',
    lastUpdated: new Date().toISOString()
  },
  {
    title: 'Digital India Initiative',
    description: 'Flagship programme to transform India into a digitally empowered society and knowledge economy.',
    link: 'https://digitalindia.gov.in/',
    category: 'Technology',
    ministry: 'Ministry of Electronics and Information Technology',
    lastUpdated: new Date().toISOString()
  },
  {
    title: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
    description: 'Skill development scheme to enable Indian youth to take up industry-relevant skill training.',
    link: 'https://www.pmkvyofficial.org/',
    category: 'Employment',
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    lastUpdated: new Date().toISOString()
  },
  {
    title: 'Beti Bachao Beti Padhao',
    description: 'Government scheme aimed at generating awareness and improving the efficiency of welfare services for girls.',
    link: 'https://wcd.nic.in/bbbp-scheme',
    category: 'Women Empowerment',
    ministry: 'Ministry of Women and Child Development',
    lastUpdated: new Date().toISOString()
  },
  {
    title: 'Ayushman Bharat Digital Mission',
    description: 'Creating a digital health ecosystem to provide accessible, affordable and quality healthcare.',
    link: 'https://abdm.gov.in/',
    category: 'Healthcare',
    ministry: 'Ministry of Health and Family Welfare',
    lastUpdated: new Date().toISOString()
  },
  {
    title: 'PM SVANidhi (Street Vendor AtmaNirbhar Nidhi)',
    description: 'Micro-credit scheme to provide affordable loans to street vendors affected by COVID-19.',
    link: 'https://pmsvanidhi.mohua.gov.in/',
    category: 'Financial Inclusion',
    ministry: 'Ministry of Housing and Urban Affairs',
    lastUpdated: new Date().toISOString()
  },
  {
    title: 'National Education Policy 2020',
    description: 'Comprehensive framework for elementary education to higher education as well as vocational training.',
    link: 'https://www.education.gov.in/nep',
    category: 'Education',
    ministry: 'Ministry of Education',
    lastUpdated: new Date().toISOString()
  },
  {
    title: 'Pradhan Mantri Awas Yojana (PMAY)',
    description: 'Housing for All mission to provide affordable housing to urban and rural poor.',
    link: 'https://pmaymis.gov.in/',
    category: 'Housing',
    ministry: 'Ministry of Housing and Urban Affairs',
    lastUpdated: new Date().toISOString()
  },
  {
    title: 'Unique Disability ID (UDID)',
    description: 'Creating a National Database for Persons with Disabilities to issue Unique Disability Identity Cards.',
    link: 'https://www.swavlambancard.gov.in/',
    category: 'Disability',
    ministry: 'Department of Empowerment of Persons with Disabilities',
    lastUpdated: new Date().toISOString()
  }
]

async function fetchSchemes(): Promise<Scheme[]> {
  try {
    // In production, this would scrape from official government portals
    // For now, return sample data with current timestamps
    return SAMPLE_SCHEMES.map(scheme => ({
      ...scheme,
      lastUpdated: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Error fetching schemes:', error)
    return SAMPLE_SCHEMES
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    // Check cache
    if (schemesCache && (Date.now() - schemesCache.timestamp) < CACHE_DURATION) {
      let data = schemesCache.data
      
      // Filter by category if provided
      if (category && category !== 'all') {
        data = data.filter(scheme => 
          scheme.category.toLowerCase().includes(category.toLowerCase())
        )
      }
      
      return NextResponse.json({
        success: true,
        data,
        cached: true,
        lastUpdated: new Date(schemesCache.timestamp).toISOString()
      })
    }
    
    // Fetch fresh schemes
    const schemes = await fetchSchemes()
    
    // Update cache
    schemesCache = {
      data: schemes,
      timestamp: Date.now()
    }
    
    let data = schemes
    
    // Filter by category if provided
    if (category && category !== 'all') {
      data = data.filter(scheme => 
        scheme.category.toLowerCase().includes(category.toLowerCase())
      )
    }
    
    return NextResponse.json({
      success: true,
      data,
      cached: false,
      lastUpdated: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Schemes API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch schemes',
      data: []
    }, { status: 500 })
  }
}