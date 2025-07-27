import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { authService } from '@/lib/services/auth.service'
import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@/lib/types/auth.types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Helper function to get token from cookies
const getTokenFromCookies = () => {
  if (typeof window === 'undefined') return null
  return Cookies.get('token') || null
}

// Helper function to check if user is authenticated
const checkIsAuthenticated = () => {
  const token = getTokenFromCookies()
  return !!token
}

const initialState: AuthState = {
  user: null,
  token: getTokenFromCookies(),
  isAuthenticated: checkIsAuthenticated(),
  isLoading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response: AuthResponse = await authService.adminLogin(credentials)
      console.log('response', response)
      // Store token in cookie
      Cookies.set('token', response.token, { expires: response.expiresIn })

      return response
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      console.log('error', error)

      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response: AuthResponse =
        await authService.adminRegister(credentials)

      // Store token in cookie
      Cookies.set('token', response.token, { expires: 7 })

      return response
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any

      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

export const logoutUser = createAsyncThunk(
  'common/logout',
  async (role: string, { rejectWithValue }) => {
    try {
      await authService.logout(role)

      // Remove token from cookie
      Cookies.remove('token')

      return null
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any

      // Even if logout fails, remove token locally
      Cookies.remove('token')
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'common/me',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser()
      return user
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any

      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user'
      )
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = true
      Cookies.set('token', action.payload, { expires: 7 })
    },
    clearAuth: state => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      Cookies.remove('token')
    },
    // Action to sync state with cookies on app initialization
    syncWithCookies: state => {
      const token = getTokenFromCookies()
      state.token = token
      state.isAuthenticated = !!token
      // If no token, clear user data
      if (!token) {
        state.user = null
      }
      console.log('AuthSlice - Synced with cookies:', {
        token: !!token,
        user: !!state.user,
      })
    },
    // Debug action to log current state
    debugState: state => {
      console.log('AuthSlice - Current state:', {
        user: state.user,
        token: !!state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
      })
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('action', action)
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(registerUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logoutUser.pending, state => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload as string
      })

    // Get current user
    builder
      .addCase(getCurrentUser.pending, state => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload as string
        Cookies.remove('token')
      })
  },
})

export const { clearError, setToken, clearAuth, syncWithCookies, debugState } =
  authSlice.actions
export default authSlice.reducer
