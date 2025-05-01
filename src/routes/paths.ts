// utils
import { paramCase } from '@/utils/change-case'

// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  MAIN: '/',
}

const random = '/con-so-may-man'
const wheel = '/vong-quay-may-man'

// ----------------------------------------------------------------------

export const paths = {
  root: '/',
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  figma:
    'https://www.figma.com/file/kAYnYYdib0aQPNKZpgJT6J/%5BPreview%5D-Minimal-Web.v5.0.0?type=design&node-id=0%3A1&t=Al4jScQq97Aly0Mn-1',
  // product: {
  //   root: `/product`,
  //   checkout: `/product/checkout`,
  //   details: (id: string) => `/product/${id}`,
  //   demo: {
  //     details: `/product/${MOCK_ID}`,
  //   },
  // },
  // post: {
  //   root: `/post`,
  //   details: (title: string) => `/post/${paramCase(title)}`,
  //   demo: {
  //     details: `/post/${paramCase(MOCK_TITLE)}`,
  //   },
  // },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/login`,
      signUp: `${ROOTS.AUTH}/jwt/register`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      updatePassword: `${ROOTS.AUTH}/jwt/update-password`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    document: {
      root: `${ROOTS.DASHBOARD}/document/list`,
      category: {
        root: `${ROOTS.DASHBOARD}/document/category`,
        new: `${ROOTS.DASHBOARD}/document/category/add`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/document/category/${id}`,
      },
      subCategory: {
        root: `${ROOTS.DASHBOARD}/document/subCategory`,
        new: `${ROOTS.DASHBOARD}/document/subCategory/add`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/document/subCategory/${id}`,
      },
      page: {
        root: `${ROOTS.DASHBOARD}/document/page`,
        new: `${ROOTS.DASHBOARD}/document/page/add`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/document/page/${id}`,
      },
    },

    //
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      // demo: {
      //   edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      // },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
      //   edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      // },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
      //   edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      // },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title: string) =>
        `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
      //   edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      // },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      // },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
      //   edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      // },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
      //   edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      // },
    },
  },
  // MAIN
  main: {
    fortune: {
      wheel: {
        root: wheel,
        new: `${wheel}/add`,
        edit: (id: string) => `${wheel}/${id}/edit`,
        detail: (id: string) => `${wheel}/${id}`,
      },
      random: {
        root: random,
        new: `${random}/add`,
        edit: (id: string) => `${random}/${id}/edit`,
        detail: (id: string) => `${random}/${id}`,
      },
    },
  },
}
