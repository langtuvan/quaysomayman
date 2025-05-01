import { ApolloError } from '@apollo/client'
import { type GraphQLFormattedError } from 'graphql'
import _ from 'lodash'

type MutationApolloErrorType = {
  message: {
    field: string
    message: string
  }[]
  error?: string
  statusCode?: number
}

type OriginalError = {
  message: string
  error: string
  statusCode: number
}

type Extensions = {
  code: string
  originalError: OriginalError
}

export function MutationApolloError(
  apolloError: ApolloError,
): MutationApolloErrorType {
  if (apolloError.networkError) {
    return {
      message: [
        {
          field: 'errorMessage',
          message: 'Đường truyền bị lỗi, vui lòng thử lại sau.',
        },
      ],
    }
  }

  const graphQLErrors = apolloError.graphQLErrors[0]

  const {
    extensions: { code, originalError },
  } = graphQLErrors as any
  const error = originalError as MutationApolloErrorType

  if (code === 'BAD_REQUEST') {
    if (Array.isArray(error?.message)) return error
    return {
      ...error,
      message: [
        {
          field: 'errorMessage',
          message: error?.message as any,
        },
      ],
    }
  }

  return {
    message: [
      {
        field: 'errorMessage',
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      },
    ],
  }
}

type ReturnQueryType = {
  statusCode: number
  error: string
  message: string
}

export function QueryApolloError(apolloError: ApolloError): ReturnQueryType {
  if (apolloError.networkError) {
    return {
      message: 'Đường truyền bị lỗi, vui lòng thử lại sau.',
      error: 'NETWORK_ERROR',
      statusCode: 500,
    }
  }

  const graphQLErrors = apolloError.graphQLErrors[0]

  const { extensions } = graphQLErrors as any

  return {
    statusCode: extensions?.originalError?.statusCode || 500,
    error: extensions?.code || 'INTERNAL_SERVER_ERROR',
    message: extensions?.originalError?.message || 'Đã có lỗi xảy ra',
  }
}
