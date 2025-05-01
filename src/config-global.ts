import { ApolloClient, InMemoryCache } from '@apollo/client'
import { paths } from './routes/paths'
// routes
// API
// ----------------------------------------------------------------------

export const CONFIG = {
  site: {
    name: 'Tailwind',
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
    serverGraphql: process.env.NEXT_PUBLIC_SERVER_GRAPHQL_URL ?? '',
    serverGraphqlWs: process.env.NEXT_PUBLIC_SERVER_GRAPHQL_URL_WSLINK ?? '',
    assetURL: process.env.NEXT_PUBLIC_ASSET_URL ?? '',
    //basePath: '192.168.137.3:3000',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  },
  //isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`),
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.root,
  },
}

export const HOST_API = CONFIG.site.serverUrl
export const HOST_GRAPHQL = CONFIG.site.serverGraphql
export const HOST_GRAPHQL_WS = CONFIG.site.serverGraphqlWs
//
export const ASSET_URL = CONFIG.site.assetURL
export const BASE_URL = CONFIG.site.basePath

export const CACHE_ENV =
  (process.env.NEXT_CACHE_ENV as 'force-cache' | 'reload') || 'reload'

export const WEBSITE_NAME = 'Web Next App'

const isDev = process.env.NODE_ENV === 'development'

export const PATH_AUTH = {
  LOGIN: '/auth/jwt/login',
  REGISTER: '/auth/jwt/register',
  LOGOUT: '/auth/jwt/signout',
  // RESET_PASSWORD: "/auth/jwt/resetPassword",
  // PATH_AFTER_LOGIN: "/components",
  // PATH_AFTER_LOGIN_USER: "/components",
  // PATH_AUTH_SUCCESS: "/auth/success",
}

export const PATH_DASHBOARD = {
  HOME: {
    DISPLAY_NAME: 'Dashboard',
    HREF: '/dashboard',
  },
  ECOMMERCE: {
    DISPLAY_NAME: 'ecommerce',
    HREF: '/dashboard/ecommerce/',
    CATEGORY: {
      DISPLAY_NAME: 'Category',
      LIST: '/dashboard/ecommerce/category',
      ADD: '/dashboard/ecommerce/category/add',
      EDIT: (id: string) => `/dashboard/ecommerce/category/${id}/edit`,
    },
    SUB_CATEGORY: {
      DISPLAY_NAME: 'Sub Category',
      LIST: '/dashboard/ecommerce/subCategory',
      ADD: '/dashboard/ecommerce/subCategory/add',
      EDIT: (id: string) => `/dashboard/ecommerce/subCategory/${id}/edit`,
    },
    PRODUCT: {
      DISPLAY_NAME: 'Product',
      LIST: '/dashboard/ecommerce/product',
      ADD: '/dashboard/ecommerce/product/add',
      EDIT: (id: string) => `/dashboard/ecommerce/product/${id}/edit`,
    },
    FAQ: {
      DISPLAY_NAME: 'faq',
      LIST: '/dashboard/ecommerce/faq',
      ADD: '/dashboard/ecommerce/faq/add',
      EDIT: (id: string) => `/dashboard/ecommerce/faq/${id}/edit`,
    },
  },
}

export const PATH_PAGE = {
  SITEMAP: '/sitemap.xml',
  HOME: '/',
  COMPONENTS: '/components',
  NEXTJS: '/learn/nextjs',
  PRICING: '/components#pricing',
  ABOUT: '/about',
  CONTACT: '/contact',
  CHECK_OUT: '/checkout',
  ORDER_SUMMARIES: '/order-summaries',
}

export const AUTH0_API = {
  googleAuth: `${HOST_API}/auth/google`,
  facebookAuth: `${HOST_API}/auth/facebook`,
  //clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  //domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  //callbackUrl: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
}

export const PRODUCT_IMAGE_URL = `/uploads/image/product`

// ROOT PATH AFTER LOGIN SUCCESSFUL
// export const PATH_LOGIN = paths.auth.jwt.login; // as '/dashboard'
// export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
//export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

// export const FIREBASE_API = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// export const AMPLIFY_API = {
//   userPoolId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_ID,
//   userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
//   region: process.env.NEXT_PUBLIC_AWS_AMPLIFY_REGION,
// };

// export const MAPBOX_API = process.env.NEXT_PUBLIC_MAPBOX_API;
