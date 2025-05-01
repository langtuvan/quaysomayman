'use client'
import { useAuthContext } from '@/auth/hooks'
import { ProcessingScreen } from '@/components/LoadingScreen'
import { CustomStates } from '@/components/States'
import { useCustomRouter } from '@/hooks/useCustomRouter'
import { useLayoutEffect, useState } from 'react'

export default function VerifyAccessToken({ token }: { token: string }) {
  const { goTo, router } = useCustomRouter()
  const { signInWithSSo, authenticated, loading } = useAuthContext()

  // state
  const [isChecking, setIsChecking] = useState<boolean>(true)
  const [isTokenError, setIsTokenError] = useState(false)

  const verifyTokenFn = async () => {
    //const returnTo = localStorage.getItem('returnTo')
    const verify = await signInWithSSo(token)
    if (verify) {
      return goTo('/')
    } else {
      setIsTokenError(true)
    }
    setIsChecking(false)
  }

  useLayoutEffect(() => {
    // check authenticated
    if (authenticated) {
      const returnTo = localStorage.getItem('returnTo')
      return returnTo ? goTo(returnTo) : router.back()
    }
    // start loading
    setIsChecking(true)

    // check valid token
    if (!token) {
      return setIsChecking(false)
    }

    // verify token
    verifyTokenFn()
  }, [token, authenticated])

  if (isChecking) {
    return <ProcessingScreen />
  }

  // token is error
  if (isTokenError) {
    return (
      <CustomStates
        statusCode={400}
        title="Access token không hợp lệ"
        description="Please login to get access token"
      />
    )
  }

  return (
    <CustomStates
      statusCode={404}
      title="Access token không tìm thấy"
      description="Please login to get access token"
    />
  )
}
