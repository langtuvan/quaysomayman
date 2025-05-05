import { type Dispatch, type SetStateAction } from 'react'

export type UserType = (Record<string, any> & { accessToken: string }) | null

export type AuthState = {
  user:
    | (UserType & {
        plan: {
          maxFortune: number
        }
      })
    | null
  //config: any
  menu: any
  loading: boolean
}

export type SignInParams = {
  email?: string
  phone?: string
  password: string
  isSignInWithEmail: boolean
}

export type SignUpParams = {
  name: string
  email?: string
  phone?: string
  password: string
  confirmPassword: string
  isSignUpWithEmail: boolean
}

export type AuthContextValue = {
  user: UserType
  menu: any
  loading: boolean
  authenticated: boolean
  unauthenticated: boolean
  checkUserSession?: () => Promise<boolean>
  // actions
  signUpWithPassword: (params: SignUpParams) => Promise<any>
  signInWithPassword: (params: SignInParams) => Promise<boolean>
  signInWithSSo: (accessToken: string) => Promise<boolean>
  signOut: () => Promise<void>

  // open Login Form
  openLoginForm: boolean
  setOpenLoginForm: Dispatch<SetStateAction<boolean>>
}
