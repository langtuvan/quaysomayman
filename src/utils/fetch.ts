import { NextRequest } from 'next/server'
import { HOST_API, CACHE_ENV } from '../config-global'

export const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  cache: CACHE_ENV || 'reload',
}

export const path = (url: string) => `${HOST_API}${url}`

export const fetchData = async (url: string, option?: RequestInit) => {
  const res = await fetch(path(url), { ...defaultOptions, ...option })
  if (!res.ok) {
    return { status: res?.status || 400, message: res?.statusText || '' }
  }
  return res.json()
}
export const fetcher = (url: string) =>
  fetch(path(url), { ...defaultOptions }).then((r) => r.json())

export const fetchInstance = async (url: string, option?: RequestInit) => {
  const res = await fetch(path(url), { ...defaultOptions, ...option })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw Error()
    //`Api Error: ${url} , statusCode: ${res.status} , message: ${res.statusText}`,
  }
  return res.json()
}

export const fetchGraphql = async ({
  body,
  cache = CACHE_ENV,
}: {
  body: string
  cache?: RequestCache
}) => {
  const res = await fetch('http://localhost:5000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    cache,
  })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default fetchInstance
