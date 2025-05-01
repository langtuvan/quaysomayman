import { BASE_URL } from '@/config-global'
import { type MetadataRoute } from 'next'

// type Sitemap = Array<{
//   url: string;
//   lastModified?: string | Date;
//   changeFrequency?:
//     | "always"
//     | "hourly"
//     | "daily"
//     | "weekly"
//     | "monthly"
//     | "yearly"
//     | "never";
//   priority?: number;
// }>;

const staticSiteMap: MetadataRoute.Sitemap = [
  {
    url: '/',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  },
  {
    url: `${BASE_URL}/vong-quay-may-man`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/con-so-may-man`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/gioi-thieu`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
]

// export async function generateSitemaps() {
//   // Fetch the total number of products and calculate the number of sitemaps needed
//   // return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
//   return [{ id: 0 }];
// }

// const { PRICING, SITEMAP, ...staticSites } = PATH_PAGE

// const getStaticSitemapsData = _.values(staticSites)

export default async function sitemap({ id }: { id: number }): Promise<any> {
  // Google's limit is 50,000 URLs per sitemap
  // const start = id * 50000
  // const end = start + 50000
  // const products = await getProducts(
  //   `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  // )

  return [...staticSiteMap]
}
