'use server'
import VerifyAccessToken from './VerifyAccessToken'

export default async function getAccessTokenPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const accessToken = (await searchParams).accessToken
  return <VerifyAccessToken token={accessToken as string} />
}
