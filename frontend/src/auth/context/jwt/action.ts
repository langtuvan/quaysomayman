'use client'

import axios, { endpoints } from '@/utils/axios'

import { setSession } from './utils'
import { STORAGE_KEY } from './constant'
import axiosInstance from '@/utils/axios'
import { usePathname, useRouter } from 'next/navigation'

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string
  password: string
}

export type SignUpParams = {
  email: string
  password: string
  firstName: string
  lastName: string
}

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({
  email,
  password,
}: SignInParams): Promise<void> => {
  try {
    const params = { email, password }

    const res = await axios.post(endpoints.auth.signIn, params)

    const { accessToken } = res.data

    if (!accessToken) {
      throw new Error('Access token not found in response')
    }

    setSession(accessToken)
  } catch (error) {
    console.error('Error during sign in:', error)
    throw error
  }
}

export const signInWithSso = async ({
  email,
  password,
}: SignInParams): Promise<void> => {
  try {
    const params = { email, password }

    const res = await axios.post(endpoints.auth.signIn, params)

    const { accessToken } = res.data

    if (!accessToken) {
      throw new Error('Access token not found in response')
    }

    setSession(accessToken)
  } catch (error) {
    console.error('Error during sign in:', error)
    throw error
  }
}

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  }

  try {
    const res = await axios.post(endpoints.auth.signIn, params)

    const { accessToken } = res.data

    if (!accessToken) {
      throw new Error('Access token not found in response')
    }

    sessionStorage.setItem(STORAGE_KEY, accessToken)
  } catch (error) {
    console.error('Error during sign up:', error)
    throw error
  }
}

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  
  try {
    await setSession(null)

    const response = await axiosInstance.post(endpoints.auth.signOut)
    //return response
  } catch (error) {
    location.reload()
    console.error('Error during sign out:', error)
    throw error
  }
}
