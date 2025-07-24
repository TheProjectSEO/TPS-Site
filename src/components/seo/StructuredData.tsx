import { generateStructuredData, combineStructuredData, StructuredDataType, BaseStructuredData } from '@/lib/structuredData'

interface StructuredDataProps {
  type: StructuredDataType
  data: Record<string, any>
  customJsonLd?: string | null
  customSchema?: string | object | null // Support both string and object formats
  globalSchemas?: BaseStructuredData[]
  priority?: number
  schemaMode?: 'default' | 'custom' // Control whether to use default or custom schema
}

export function StructuredData({ 
  type, 
  data, 
  customJsonLd, 
  customSchema,
  globalSchemas = [],
  priority = 0,
  schemaMode = 'default'
}: StructuredDataProps) {
  // If schema mode is custom, only use custom schema; if default, use automatic schema
  let finalSchemas: BaseStructuredData[] = []
  
  if (schemaMode === 'custom') {
    // Custom mode: only use custom schema if provided
    let customSchemaToUse = customSchema || customJsonLd
    
    // If customSchema is a string, try to parse it
    if (typeof customSchemaToUse === 'string' && customSchemaToUse.trim()) {
      try {
        customSchemaToUse = JSON.parse(customSchemaToUse)
      } catch (error) {
        console.warn('Invalid custom schema JSON:', error)
        customSchemaToUse = null
      }
    }
    
    // Only add custom schema if it exists and is valid
    if (customSchemaToUse && typeof customSchemaToUse === 'object') {
      finalSchemas = [customSchemaToUse as BaseStructuredData]
    }
  } else {
    // Default mode: use automatic schema generation
    finalSchemas = generateStructuredData({
      type,
      data
    })
  }

  // Combine with global schemas if provided
  const allSchemas = combineStructuredData(...globalSchemas, ...finalSchemas)

  // Don't render if no schemas
  if (allSchemas.length === 0) {
    return null
  }

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={`structured-data-${type}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  )
}

// Component for global website schemas
export function GlobalStructuredData({ siteData }: { siteData: Record<string, any> }) {
  const websiteSchema = generateStructuredData({
    type: 'WebSite',
    data: {
      name: siteData.name || 'TPS Site Tours',
      url: siteData.url || 'https://tps-site.com',
      description: siteData.description || 'Premier tour operator offering unforgettable experiences in TPS Site, New Zealand',
      ...siteData
    }
  })

  const organizationSchema = generateStructuredData({
    type: 'Organization',
    data: {
      name: siteData.organizationName || 'TPS Site Tours',
      url: siteData.url || 'https://tps-site.com',
      logo: siteData.logo,
      description: siteData.organizationDescription || 'Leading tour operator in TPS Site',
      telephone: siteData.telephone,
      email: siteData.email,
      social_links: siteData.socialLinks || [],
      ...siteData
    }
  })

  const localBusinessSchema = generateStructuredData({
    type: 'LocalBusiness',
    data: {
      name: siteData.businessName || 'TPS Site Tours',
      url: siteData.url || 'https://tps-site.com',
      description: siteData.businessDescription || 'Tour operator specializing in TPS Site experiences',
      telephone: siteData.telephone,
      email: siteData.email,
      street_address: siteData.streetAddress,
      city: siteData.city || 'TPS Site',
      region: siteData.region || 'Southland',
      postal_code: siteData.postalCode,
      country: siteData.country || 'NZ',
      latitude: siteData.latitude || -44.6189,
      longitude: siteData.longitude || 167.9224,
      opening_hours: siteData.openingHours || ['Mo-Su 08:00-18:00'],
      price_range: siteData.priceRange || '$$',
      social_links: siteData.socialLinks || [],
      ...siteData
    }
  })

  const allSchemas = combineStructuredData(...websiteSchema, ...organizationSchema, ...localBusinessSchema)

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={`global-structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  )
}

// Breadcrumb structured data component
export function BreadcrumbStructuredData({ breadcrumbs }: { breadcrumbs: Array<{ name: string; url: string }> }) {
  const schema = generateStructuredData({
    type: 'BreadcrumbList',
    data: { breadcrumbs }
  })

  if (schema.length === 0) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema[0], null, 0)
      }}
    />
  )
}

// FAQ structured data component
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = generateStructuredData({
    type: 'FAQPage',
    data: { faqs }
  })

  if (schema.length === 0) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema[0], null, 0)
      }}
    />
  )
}