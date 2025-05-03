'use client'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Flex } from '@/components/Flex'
import { GET_FORTUNE } from '@/graphql/fortune'
import { QueryApolloError } from '@/providers/apolloClient/utils'
import View400 from '@/sections/errors/400-view'
import { useQuery } from '@apollo/client'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { notFound, useParams } from 'next/navigation'

const FortuneNewEditForm = dynamic(
  () => import('@/sections/main/fortune/form/FortuneNewEditForm'),
  { ssr: false },
)

export default function FortuneWheelEditPage() {
  const params = useParams<{ id: string }>()

  const { data, error, refetch } = useQuery(GET_FORTUNE, {
    variables: { id: params.id },
    skip: !params.id, // load fortune when paramId is present
    fetchPolicy: 'cache-and-network',
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

  const fortune = data?.fortune

  const handleRefresh = () => {
    refetch()
    // Add delay
  }

  return (
    <>
     
        <h1 className="font-display mb-4 text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-6xl/[0.8]">
          Vòng Quay May Mắn
        </h1>
        <h2 className="mb-8 text-3xl font-light text-gray-400">Tùy Chỉnh</h2>
        <Flex className="mb-4 items-center justify-end">
          <Button
            //outline
            variant="secondary"
            className={clsx(
              'cursor-pointer hover:bg-zinc-100 active:bg-zinc-900',
            )}
            onClick={handleRefresh}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </Button>
        </Flex>
        {fortune && (
          <FortuneNewEditForm currentData={fortune} addType="wheel" />
        )}
   
    </>
  )
}
