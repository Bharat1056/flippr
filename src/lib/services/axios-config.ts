/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import env from '@/lib/config/env'
import Cookies from 'js-cookie'

export interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
  statusCode: number
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

class ApiClient {
  private instance: AxiosInstance
  private baseURL: string

  constructor(baseURL: string = env.NEXT_PUBLIC_API_BASE_URL) {
    this.baseURL = baseURL
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      config => {
        // Add auth token if available
        const refreshToken = this.getAuthToken()
        if (refreshToken) {
          config.headers.Authorization = `Bearer ${refreshToken}`
        }

        // Add request timestamp for debugging
        if (env.NODE_ENV === 'development') {
          console.log(
            `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
            {
              params: config.params,
              data: config.data,
            }
          )
        }

        return config
      },
      (error: AxiosError) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        if (env.NODE_ENV === 'development') {
          console.log(
            `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
            {
              status: response.status,
              data: response.data,
            }
          )
        }

        return response
      },
      (error: AxiosError<ApiError>) => {
        this.handleError(error)
        return Promise.reject(error)
      }
    )
  }

  private handleError(error: AxiosError<ApiError>): void {
    const { response, request, message } = error

    if (env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        message,
        status: response?.status,
        data: response?.data,
        url: request?.responseURL,
      })
    }

    // Handle specific error cases
    if (response?.status) {
      if (response?.status === 401) {
        this.handleUnauthorized()
      } else if (response?.status === 403) {
        this.handleForbidden()
      } else if (response?.status >= 500) {
        this.handleServerError()
      }
    }
  }

  private handleUnauthorized(): void {
    this.removeAuthToken()
    // Redirect to login or show auth modal
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  private handleForbidden(): void {
    // Handle forbidden access
    console.warn('Access forbidden')
  }

  private handleServerError(): void {
    // Handle server errors
    console.error('Server error occurred')
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    // Try to get token from cookie first, then localStorage as fallback
    const tokenCookie = Cookies.get('token')
    return tokenCookie ?? null
  }

  private removeAuthToken(): void {
    if (typeof window === 'undefined') return
    // Remove from both cookie and localStorage
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    localStorage.removeItem('auth_token')
  }

  public setAuthToken(token: string): void {
    if (typeof window === 'undefined') return
    // Set in both cookie and localStorage
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`
    localStorage.setItem('auth_token', token)
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config)
    return response.data.data
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config)
    return response.data.data
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config)
    return response.data.data
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<ApiResponse<T>>(
      url,
      data,
      config
    )
    return response.data.data
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config)
    return response.data.data
  }

  // Upload file method
  async upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.instance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(progress)
        }
      },
    })

    return response.data.data
  }

  // Get instance for custom requests
  getInstance(): AxiosInstance {
    return this.instance
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient()

// Export types for use in other files
export type { AxiosRequestConfig, AxiosResponse, AxiosError }
