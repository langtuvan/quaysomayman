export type OriginalError = {
  message: string
  error: string
  statusCode: number
}

export type Extensions = {
  code: string
  originalError: OriginalError
}

export type ValidateError = {
  message: InputError[]
  error?: string
  statusCode: number
}

export type InputError = {
  field: string
  message: string
}
