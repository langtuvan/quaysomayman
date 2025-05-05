'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import path from 'path'

export const useCustomRouter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const pathName = usePathname()

  // const name = searchParams.get('name')
  // Custom function to navigate to a path
  const goTo = (path: string) => {
    router.push(path)
  }

  // Function to replace the current route without adding to the history
  const replaceRoute = (path: string) => {
    router.replace(path, { scroll: false })
  }

  const updateQueryParams = (paramsObj: Object) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(paramsObj).forEach(([key, value]) => {
      params.set(key, value)
    })
    replaceRoute(`?${params.toString()}`)
  }

  const clearQueryParams = () => {
    replaceRoute(pathName)
  }

  const removeQueryParam = (stringArr: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    stringArr.map((key) => params.delete(key))
    replaceRoute(`?${params.toString()}`)
  }

  return {
    // default
    pathName,
    router,
    useParams,

    searchParams,
    goTo,
    replaceRoute,

    params,
    updateQueryParams,
    clearQueryParams,
    removeQueryParam,
  }
}
