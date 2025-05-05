'use client'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  createHttpLink,
  ApolloLink,
  HttpLink,
  //NormalizedCacheObject,
  split,
  useMutation,
} from '@apollo/client'

import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'
import { STORAGE_KEY } from '@/auth/context/jwt'
import { HOST_API, HOST_GRAPHQL, HOST_GRAPHQL_WS } from '@/config-global'
import { createContext, useContext, useEffect, useState } from 'react'

import { stripTypename } from '@apollo/client/utilities'


// A simple loading tracker
let activeMutations = 0
let activeQueries = 0
let activeSubscriptions = 0

// Update loading middleware with better tracking
const loadingMiddleware = new ApolloLink((operation, forward) => {
  const context = operation.getContext()
  //console.log('loadingMiddleware', context)
  //const setContext = context.setContext
  const { loadingDelay = 500, showLoader = false } = context

  if (
    showLoader &&
    operation.query.definitions.some((def: any) => def.operation === 'mutation')
  ) {
    activeMutations += 1
    //NProgress.start()
    console.log('loadingMiddleware activeMutations ++', activeMutations)
  }

  if (
    showLoader &&
    operation.query.definitions.some((def: any) => def.operation === 'query')
  ) {
    activeQueries += 1
  }

  console.log('loadingMiddleware activeMutations 2', activeMutations)

  return forward(operation).map((response) => {
    // Decrement the active count for mutations
    if (
      showLoader &&
      operation.query.definitions.some(
        (def: any) => def.operation === 'mutation',
      )
    ) {
      setTimeout(() => {
        activeMutations -= 1
        console.log('loadingMiddleware activeMutations --', activeMutations)
      }, loadingDelay)
    }
    // Decrement the active count for queries
    if (
      showLoader &&
      operation.query.definitions.some((def: any) => def.operation === 'query')
    ) {
      setTimeout(() => {
        activeQueries -= 1
      }, loadingDelay)
      // if (activeMutations === false) {
      //   NProgress.done()
      // }
    }
    return response
  })
})

const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    if (response.errors) {
      response.errors.forEach((err) => {
        // Handle specific error codes
        switch (err.extensions?.code) {
          case 'UNAUTHENTICATED':
            // Handle auth errors - redirect to login
            console.log('UNAUTHENTICATED ABC')
            //window.location.href = '/auth/login'
            break
          case 'FORBIDDEN':
            // Handle permission errors
            console.log('FORBIDDEN')
            //toast.error('Không có quyền truy cập');
            break
          default:
          // Handle other errors
          //console.log('Error', err)
          //toast.error(err.message || 'Đã xảy ra lỗi');
        }
      })
    }

    return response
  })
})

const stripTypenameLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    if (response.data) {
      response.data = stripTypename(response.data)
    }
    return response
  }),
)

// HTTP link to your GraphQL API
const httpLink = new HttpLink({
  uri: HOST_GRAPHQL,
  //uri: 'http://localhost:5000/graphql', // Replace with your GraphQL API URL
})

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: HOST_GRAPHQL_WS,
    
  }),
)

// Split traffic based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink, // Use WebSocket for subscriptions
  httpLink, // Use HTTP for queries and mutations
)

// Middleware to dynamically set the Authorization header
const authLink = setContext((_, { headers }) => {
  // Retrieve the token from wherever it is stored
  const token = localStorage.getItem(STORAGE_KEY)
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// export const client = new ApolloClient({
//   uri: `${HOST_API}/graphql`,
//   cache: new InMemoryCache(),
// })

export const AdminClient = new ApolloClient({
  link: ApolloLink.from([
    //errorLink, // Add error link first
    //loadingMiddleware,
    //splitLink,
    authLink.concat(splitLink),
    //stripTypenameLink,
  ]),
  //link: splitLink,
  cache: new InMemoryCache({
    addTypename: true,
  }),
  connectToDevTools: true,
  defaultOptions: {
    // Add error policies
    watchQuery: {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    // query: {
    //   errorPolicy: 'all',
    // },
    // mutate: {
    //   errorPolicy: 'all',
    // },
  },
})

export const LoadingContext = createContext<{
  loading?: boolean
  setLoading?: any
}>({})

export const ApolloLoadingProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

const useLoading = () => useContext(LoadingContext)

// Update GlobalLoader component
const GlobalLoader = () => {
  return null
}

export function ApolloProvider({
  client = AdminClient,
  children,
}: {
  client?: ApolloClient<any>
  children: React.ReactNode
}) {
  return (
    <Provider client={client}>
      <GlobalLoader />
      <ApolloLoadingProvider>{children}</ApolloLoadingProvider>
    </Provider>
  )
}
