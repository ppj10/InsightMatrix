import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChartDataPoint, ChartResponse } from '../../services/api'

export interface Chart {
  _id: string
  adminId: string
  chartName: string
  chartType: 'line' | 'bar'
  data: ChartDataPoint[]
  createdAt: string
  updatedAt: string
}

export interface ChartState {
  items: Chart[]
  loading: boolean
  error: string | null
}

const initialState: ChartState = {
  items: [],
  loading: false,
  error: null,
}

const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    setChartsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setChartsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCharts: (state, action: PayloadAction<ChartResponse[]>) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },
    addChart: (state, action: PayloadAction<ChartResponse>) => {
      state.items.push(action.payload)
    },
    updateChart: (state, action: PayloadAction<ChartResponse>) => {
      const index = state.items.findIndex((chart) => chart._id === action.payload._id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    removeChart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((chart) => chart._id !== action.payload)
    },
  },
})

export const { setChartsLoading, setChartsError, setCharts, addChart, updateChart, removeChart } =
  chartSlice.actions
export default chartSlice.reducer
