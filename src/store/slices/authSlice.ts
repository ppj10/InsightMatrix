import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthState {
  token: string | null
  admin: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('authToken'),
  admin: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Initialize admin from token if it exists
if (initialState.token) {
  try {
    const decoded = jwtDecode<{ id: string; email: string; name: string; role: string }>(
      initialState.token
    )
    initialState.admin = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
    initialState.isAuthenticated = true
  } catch (e) {
    localStorage.removeItem('authToken')
    initialState.token = null
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; admin: AuthUser }>) => {
      state.token = action.payload.token
      state.admin = action.payload.admin
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      localStorage.setItem('authToken', action.payload.token)
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
      state.isAuthenticated = false
    },
    logout: (state) => {
      state.token = null
      state.admin = null
      state.isAuthenticated = false
      state.error = null
      state.loading = false
      localStorage.removeItem('authToken')
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setAuthLoading, loginSuccess, loginError, logout, clearError } = authSlice.actions
export default authSlice.reducer
