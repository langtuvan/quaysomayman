'use client'
import { ForbiddenGuard } from '@/auth/guard/forbidden-guard'
import { GET_FORTUNE } from '@/graphql/fortune'
import { QueryApolloError } from '@/providers/apolloClient/utils'
import View400 from '@/sections/errors/400-view'
import { useQuery } from '@apollo/client'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CheckUserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  // hooks
  const params = useParams<{ id: string }>()
  useEffect(() => {
    if (params.id === undefined) {
      return notFound()
    }
    setIsLoading(true)
  }, [params.id])
  // load fortune when wheelId is present
  const { error } = useQuery(GET_FORTUNE, {
    variables: { id: params.id },
    skip: !params.id,
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {
      // Add delay before hiding loading screen
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    },
    onError: () => {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    },
  })

  // get Apollo Error Until
  const err = error ? QueryApolloError(error) : null

  if (err?.statusCode === 404) {
    return notFound()
  }

  if (err?.statusCode === 400) {
    return (
      <View400
        statusCode={err.statusCode}
        title={err.error}
        description={err.message}
      />
    )
  }

  // get Apollo Error Until

  const forbidden = err?.statusCode === 403

  return (
      <ForbiddenGuard forbidden={forbidden}>{children}</ForbiddenGuard>
  
  )
}
