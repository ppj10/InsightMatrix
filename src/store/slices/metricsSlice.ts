import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Metric {
  id: string
  label: string
  value: number
  change: number
  trend: 'up' | 'down'
}

export interface MetricsState {
  items: Metric[]
  loading: boolean
  error: string | null
}

const initialState: MetricsState = {
  items: [
    {
      id: '1',
      label: 'Total Revenue',
      value: 45230,
      change: 12.5,
      trend: 'up',
    },
    {
      id: '2',
      label: 'Active Users',
      value: 8542,
      change: 5.2,
      trend: 'up',
    },
    {
      id: '3',
      label: 'Conversion Rate',
      value: 3.8,
      change: -2.1,
      trend: 'down',
    },
    {
      id: '4',
      label: 'Avg Order Value',
      value: 125.4,
      change: 8.7,
      trend: 'up',
    },
  ],
  loading: false,
  error: null,
}

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    setMetricsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setMetricsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMetrics: (state, action: PayloadAction<Metric[]>) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },
  },
})

export const { setMetricsLoading, setMetricsError, setMetrics } =
  metricsSlice.actions
export default metricsSlice.reducer
