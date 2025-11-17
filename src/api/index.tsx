import axios from 'axios'
import { IApiError, IHeaderProps } from './interface'
import Cookies from 'js-cookie'

export const BaseURL = import.meta.env.VITE_API_URL;

const defaultHeaders: IHeaderProps = {
  isAuth: true,
  AdditionalParams: {},
  isJsonRequest: true,
  api_key: true,
  isFormData: false,
  'x-device-type': 'web',
}

export const ApiPostNoAuth = async (type: string, userData?: unknown, visitorId?: string) => {
  try {
    const headers = await getHttpOptions({
      ...defaultHeaders,
      isAuth: false,
      visitorId,
    })
    const response = await axios.post(BaseURL + type, userData, headers)
    if (response.data.statusCode === 400) {
      throw { status: 400, message: response.data.body }
    }
    return response.data
  } catch (error) {
    throw error
  }
}

export const ApiPutNoAuth = async (type: string, userData: unknown) => {
  try {
    const headers = await getHttpOptions({ ...defaultHeaders, isAuth: false })
    const response = await axios.put(BaseURL + type, userData, headers)
    return response.data
  } catch (error) {
    throw error
  }
}

export const ApiGetNoAuth = async (type: string) => {
  try {
    const headers = await getHttpOptions({ ...defaultHeaders, isAuth: false })
    const response = await axios.get(BaseURL + type, headers)
    return response.data
  } catch (error) {
    throw error
  }
}

export const ApiGet = async (type: string) => {
  try {
    const headers = await getHttpOptions()
    const response = await axios.get(BaseURL + type, headers)
    return response.data
  } catch (error) {
    if ((error as IApiError).response?.status === 401 || (error as IApiError).response?.status === 403) {
      Cookies.remove('token')
      window.location.href = '/auth/login'
    }
    throw error
  }
}

export const ApiPost = async (type: string, userData?: unknown, AdditionalHeader?: any) => {
  try {
    const headers = await getHttpOptions({ ...defaultHeaders, ...AdditionalHeader })
    const response = await axios.post(BaseURL + type, userData, headers)
    return response.data
  } catch (error) {
    if ((error as IApiError).response?.status === 401 || (error as IApiError).response?.status === 403) {
      Cookies.remove('token')
      window.location.href = '/auth/login'
    }
    throw error
  }
}

export const ApiPut = async (type: string, userData: unknown, additionalHeader?: Partial<IHeaderProps>) => {
  try {
    const headers = await getHttpOptions({ ...defaultHeaders, ...additionalHeader })
    const response = await axios.put(BaseURL + type, userData, headers)
    return response.data
  } catch (error) {
    if ((error as IApiError).response?.status === 401 || (error as IApiError).response?.status === 403) {
      Cookies.remove('token')
      window.location.href = '/auth/login'
    }
    throw error
  }
}

export const ApiPatch = async (type: string, userData: unknown) => {
  try {
    const headers = await getHttpOptions()
    const response = await axios.patch(BaseURL + type, userData, headers)
    return response.data
  } catch (error) {
    if ((error as IApiError).response?.status === 401 || (error as IApiError).response?.status === 403) {
      Cookies.remove('token')
      window.location.href = '/auth/login'
    }
    throw error
  }
}

export const ApiDelete = async (type: string) => {
  try {
    const headers = await getHttpOptions()
    const response = await axios.delete(BaseURL + type, headers)
    return response.data
  } catch (error) {
    if ((error as IApiError).response?.status === 401 || (error as IApiError).response?.status === 403) {
      Cookies.remove('token')
      window.location.href = '/auth/login'
    }
    throw error
  }
}

export const ApiGetBuffer = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'GET', mode: 'no-cors' })
    if (!response.ok) return null
    return await response.arrayBuffer()
  } catch (error) {
    throw error
  }
}

export const getHttpOptions = async (options = defaultHeaders) => {
  let headers: any = {}
  if (options?.isAuth) {
    const token = Cookies.get('token')
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
  }
  if (options?.isJsonRequest && !options?.isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  if (options?.isFormData) {
    headers['Content-Type'] = 'multipart/form-data'
  }
  if (options?.AdditionalParams) {
    headers = { ...headers, ...options.AdditionalParams }
  }
  if (options?.['x-device-type']) {
    headers['x-device-type'] = 'web'
  }
  if (options?.visitorId) {
    headers['x-device-secret'] = options.visitorId
  }

  return { headers }
}
