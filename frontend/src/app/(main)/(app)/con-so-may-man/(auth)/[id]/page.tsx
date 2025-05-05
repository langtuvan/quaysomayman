'use client'
// hooks
import { useCustomRouter } from '@/hooks/useCustomRouter'
// apollo graphQL
import { GET_FORTUNE } from '@/graphql/fortune'
import { useQuery } from '@apollo/client'
// components
import RandomFortuneForm from '@/sections/main/fortune/random/RandomFortune'
import { useEffect } from 'react'

export default function RandomFortunePage() {
  //hooks

  //client side
  const { useParams } = useCustomRouter()
  const { id } = useParams<{ id: string }>()

  //load fortune with user token
  const { data, refetch } = useQuery(GET_FORTUNE, {
    variables: { id },
    skip: !id, // keep loading when id is not present and user is not logged in
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    const handleFocus = () => {
      refetch()
    }
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [refetch])

  const fortune = data?.fortune

  return fortune ? (
    <div className="mx-auto my-6 flex flex-col items-center justify-around gap-6 text-center leading-6">
      <RandomFortuneForm currentData={fortune} />
    </div>
  ) : null
}
