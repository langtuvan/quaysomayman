//import { MetadataRoute } from 'next'
import { WEBSITE_NAME, BASE_URL } from '@/config-global'

export default function robots(): any {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/auth/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
