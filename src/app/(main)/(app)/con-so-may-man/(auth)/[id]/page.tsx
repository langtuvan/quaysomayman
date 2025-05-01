'use client'
// hooks
import { useCustomRouter } from '@/hooks/useCustomRouter'
// apollo graphQL
import { useQuery } from '@apollo/client'
import { GET_FORTUNE } from '@/graphql/fortune'
// components
import RandomFortuneForm from '@/sections/main/fortune/random/RandomFortune'
import { CenterBox } from '@/components/LoadingScreen'
import { useEffect } from 'react'


export default function RandomFortunePage() {
  //hooks

  //client side
  const { useParams } = useCustomRouter()
  const { id } = useParams<{ id: string }>()

  //load fortune with user token
  const { data,  refetch } = useQuery(GET_FORTUNE, {
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
    <CenterBox>
      <RandomFortuneForm currentData={fortune} />
    </CenterBox>
  ) : null
}
