import axios, { AxiosError } from 'axios'
// config
import { HOST_API } from '../config-global'

import NProgress from 'nprogress'
import useSnackbar from './useSnackbar'
NProgress.configure({ showSpinner: false })

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000,
})

axiosInstance.defaults.withCredentials = true

axiosInstance.interceptors.request.use((config) => {
  NProgress.start()
  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done()
    const message = response?.data?.message

    if (message) {
      useSnackbar.success(message)
    }

    return response
  },
  (error: AxiosError | any) => {
    NProgress.done()

    const message = error?.response?.data?.message
    if (message && typeof message === 'string') {
      useSnackbar.error(message)
    }

    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong',
    )
  },
)

export const AxiosQuery = (url: string) =>
  axiosInstance.get(url).then((res) => res.data)

export default axiosInstance

export const endpoints = {
  auth: {
    me: '/auth/me',
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    userChangePassword: '/auth/change-password',
    signOut: '/auth/signOut',
    verify: '/auth/verify',
    resendOtp: '/auth/resend-otp',

    forgotPassword: '/auth/forgot-password',
    forgotChangePassword: '/auth/forgot-change-password',
  },
  main: {
    //getFreeChapters: '/query/getFreeChapters',
  },
}
