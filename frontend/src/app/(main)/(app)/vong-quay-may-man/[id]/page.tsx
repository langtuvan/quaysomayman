'use client'
import { GET_FORTUNE, GET_FORTUNE_PRIZES } from '@/graphql/fortune'
import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
// hooks
import { useAuthContext } from '@/auth/hooks'
import { useCustomRouter } from '@/hooks/useCustomRouter'
import { QueryApolloError } from '@/providers/apolloClient/utils'
import View400 from '@/sections/errors/400-view'
import { notFound } from 'next/navigation'
import { useState } from 'react'

const WheelFortune = dynamic(
  () => import('@/sections/main/fortune/wheel/WheelFortune'),
  { ssr: false },
)

export default function WheelPage() {
  //const { id } = await params
  // const [data] = await Promise.all([getWheel(id)])
  //client side
  const [isLoading, setIsLoading] = useState(true)
  const { useParams, searchParams } = useCustomRouter()
  const { id } = useParams<{ id: string }>()

  const player = searchParams.get('player') || ''
  const autoPlay = searchParams.get('autoPlay') === 'true'

  const { user } = useAuthContext()

  //load fortune when wheelId is present
  const { data, error } = useQuery(GET_FORTUNE_PRIZES, {
    variables: { id },
    skip: !id,
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

  const isCurrentUser = user
    ? user?.id === data?.guestFortune.createdBy?.id
    : false

  // //query fortune when currentUser is creator
  const { data: userData } = useQuery(GET_FORTUNE, {
    variables: { id },
    skip: !isCurrentUser,
    fetchPolicy: 'cache-first',
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

  const fortune = userData?.fortune || data?.guestFortune

  return (
    <>
      <div className="mx-auto my-6 flex flex-col items-center justify-around gap-6 text-center leading-6">
        <WheelFortune
          currentData={fortune}
          getPlayer={player}
          autoPlay={autoPlay}
          isCurrentUser={isCurrentUser}
          autoList={data?.fortune?.persons || []}
        />
      </div>
    </>
  )
}
