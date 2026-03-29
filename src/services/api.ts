// Dynamic API URL based on environment
const getAPIBaseURL = (): string => {
  // Check for explicit environment variable first (works in dev and prod)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // Production: if no env var, try same-domain /api (requires rewrite rules)
  if (import.meta.env.PROD) {
    // Use same origin if available, for Vercel API rewrite
    if (typeof window !== 'undefined' && window.location.origin) {
      return `${window.location.origin}/api`
    }
    return '/api'
  }

  // Development: default to localhost backend
  return 'http://localhost:5000/api'
}

const API_BASE_URL = getAPIBaseURL()

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔧 API Configuration:')
  console.log('  VITE_API_URL env:', import.meta.env.VITE_API_URL)
  console.log('  Environment PROD:', import.meta.env.PROD)
  console.log('  Final API_BASE_URL:', API_BASE_URL)
}

// Auth interfaces
export interface SignupData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AdminResponse {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthResponse {
  token: string
  admin: AdminResponse
}

export interface CreateUserData {
  name: string
  email: string
  status: 'active' | 'inactive'
  adminId: string
}

export interface UserResponse {
  _id: string
  name: string
  email: string
  joinDate: string
  status: 'active' | 'inactive'
  adminId: string
}

export interface ChartDataPoint {
  month: string
  revenue?: number
  users?: number
  orders?: number
}

export interface CreateChartData {
  adminId: string
  chartName: string
  chartType: 'line' | 'bar'
  data: ChartDataPoint[]
}

export interface ChartResponse {
  _id: string
  adminId: string
  chartName: string
  chartType: 'line' | 'bar'
  data: ChartDataPoint[]
  createdAt: string
  updatedAt: string
}

// Auth endpoints
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Signup failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

// Fetch users for an admin
export const fetchUsersByAdmin = async (adminId: string): Promise<UserResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${adminId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Create a new user
export const createUser = async (userData: CreateUserData): Promise<UserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create user')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Check server health
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.ok
  } catch (error) {
    console.error('Server health check failed:', error)
    return false
  }
}

// Fetch all charts for an admin
export const fetchChartsByAdmin = async (adminId: string): Promise<ChartResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/charts/${adminId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch charts')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching charts:', error)
    throw error
  }
}

// Create a new chart
export const createChart = async (chartData: CreateChartData): Promise<ChartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/charts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chartData),
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      let errorMessage = 'Failed to create chart'
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          errorMessage = `Server error (${response.status}): Unable to parse error response`
        }
      } else {
        errorMessage = `Server error (${response.status}): ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating chart:', error)
    throw error
  }
}

// Update a chart
export const updateChart = async (
  chartId: string,
  chartData: Omit<CreateChartData, 'adminId'>
): Promise<ChartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/charts/${chartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chartData),
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      let errorMessage = 'Failed to update chart'
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          errorMessage = `Server error (${response.status}): Unable to parse error response`
        }
      } else {
        errorMessage = `Server error (${response.status}): ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating chart:', error)
    throw error
  }
}

// Delete a chart
export const deleteChart = async (chartId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/charts/${chartId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      let errorMessage = 'Failed to delete chart'
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          errorMessage = `Server error (${response.status}): Unable to parse error response`
        }
      } else {
        errorMessage = `Server error (${response.status}): ${response.statusText}`
      }
      throw new Error(errorMessage)
    }
  } catch (error) {
    console.error('Error deleting chart:', error)
    throw error
  }
}
