export interface IHeaderProps {
  isAuth: boolean
  AdditionalParams: unknown
  isJsonRequest: boolean
  api_key: boolean
  isFormData: boolean
  'x-device-type': string
  visitorId?: string
}

export interface IApiError {
  response?: {
    data?: {
      message?: string
    }
    status?: number
  }
}
