'use client'
import { useEffect, useState } from 'react'

import { View403 } from '@/sections/errors'

// ----------------------------------------------------------------------

type Props = {
  forbidden: boolean | null
  children: React.ReactNode
}

export function ForbiddenGuard({ children, forbidden = null }: Props) {
  const [isChecking, setIsChecking] = useState<boolean>(true)

  const checkForbidden = () => {
    if (forbidden === null) {
      return
    }
    setIsChecking(false)
  }

  useEffect(() => {
    checkForbidden()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forbidden])

  if (isChecking) return null

  if (forbidden) {
    return <View403 />
  }
  return <>{children}</>
}
