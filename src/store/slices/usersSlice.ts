import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  name: string
  email: string
  joinDate: string
  status: 'active' | 'inactive'
  adminId: string
}

export interface UsersState {
  items: User[]
  currentPage: number
  pageSize: number
  loading: boolean
  error: string | null
  searchTerm: string
}

const initialState: UsersState = {
  items: Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    joinDate: new Date(2024, Math.random() * 12, Math.random() * 28)
      .toISOString()
      .split('T')[0],
    status: Math.random() > 0.3 ? 'active' : 'inactive',
    adminId: i % 3 === 0 ? 'admin-1' : i % 3 === 1 ? 'admin-2' : 'admin-3',
  })),
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  searchTerm: '',
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setUsersError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      state.currentPage = 1
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.items.unshift(action.payload)
      state.currentPage = 1
      state.error = null
    },
  },
})

export const {
  setUsersLoading,
  setUsersError,
  setCurrentPage,
  setSearchTerm,
  setUsers,
  addUser,
} = usersSlice.actions
export default usersSlice.reducer
