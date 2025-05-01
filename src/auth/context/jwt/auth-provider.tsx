'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSetState } from '@/hooks/use-set-state'

import axios, { endpoints } from '@/utils/axios'

import { AuthContext } from '../auth-context'
import { STORAGE_KEY } from './constant'
import { setLocalStorageJwt } from './utils'

import type { AuthState, SignInParams, SignUpParams } from '../../types'

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
    menu: [],
  })

  const [openLoginForm, setOpenLoginForm] = useState(false)

  /** **************************************
   * Check user session
   *************************************** */
  const checkUserSession = useCallback(
    async (newToken?: string) => {
      try {
        const accessToken =
          (await localStorage.getItem(STORAGE_KEY)) ||
          localStorage.getItem(STORAGE_KEY)

        if (accessToken) {
          axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
          const res = await axios.get(endpoints.auth.me)
          setLocalStorageJwt(accessToken)
          const user = res.data.user
          const menu = res.data.menu
          setState({ user, menu, loading: false })
          return true
        } else if (newToken) {
          axios.defaults.headers.common.Authorization = `Bearer ${newToken}`
          const res = await axios.get(endpoints.auth.me)
          setLocalStorageJwt(newToken)
          const user = res.data.user
          const menu = res.data.menu
          setState({ user, menu, loading: false })
          return true
        } else {
          setState({ user: null, loading: false })
          setLocalStorageJwt(null)
          return false
        }
      } catch (error) {
        setLocalStorageJwt(null)
        setState({ user: null, loading: false })
        return false
      }
    },
    [setState],
  )

  useEffect(() => {
    checkUserSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** **************************************
   * Sign up
   *************************************** */
  const signUpWithPassword = async (data: SignUpParams): Promise<boolean> => {
    try {
      const res = await axios.post(endpoints.auth.signUp, data)
      return res.data
    } catch (error) {
      throw error
    }
  }

  /** **************************************
   * Sign in
   *************************************** */
  const signInWithPassword = async (params: SignInParams): Promise<boolean> => {
    try {
      //const params = { username, password, isSignInWithEmail }
      const res = await axios.post(endpoints.auth.signIn, params)
      const { user, accessToken } = res.data
      if (!accessToken) {
        throw new Error('Access token not found in response')
      }
      setState({ user, loading: false })
      setLocalStorageJwt(accessToken)
      setOpenLoginForm(false)
      return true
    } catch (error) {
      throw error
    }
  }
  /** **************************************
   * Sign in SSO Errror here return true
   *************************************** */
  const signInWithSSo = async (accessToken: string): Promise<boolean> => {
    return checkUserSession(accessToken)
  }

  /** **************************************
   * Sign out
   *************************************** */
  const signOut = async (): Promise<void> => {
    try {
      await setLocalStorageJwt(null)
      setState({ user: null, loading: false })
      //const response = await axios.post(endpoints.auth.signOut)
      //return response
    } catch (error) {
      location.reload()

      throw error
    }
  }

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated'

  const status = state.loading ? 'loading' : checkAuthenticated

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      menu: state.menu,

      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      // actions
      signInWithPassword,
      signInWithSSo,
      signOut,
      signUpWithPassword,
      // open Login form
      openLoginForm,
      setOpenLoginForm,
    }),
    [
      checkUserSession,
      signInWithSSo,
      state.user,
      status,
      openLoginForm,
      setOpenLoginForm,
    ],
  )

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  )
}
