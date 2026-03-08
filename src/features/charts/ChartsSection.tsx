import React, { useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import { setChartsLoading, setChartsError, setCharts } from '../../store/slices/chartSlice'
import { fetchChartsByAdmin } from '../../services/api'
import { RootState } from '../../store/store'
import './ChartsSection.css'

const CHART_COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b']

const ChartDisplay: React.FC<{ chartData: any; colors: string[] }> = ({ chartData, colors }) => {
  if (!chartData.data || chartData.data.length === 0) {
    return <div className="no-data-message">No data available for this chart.</div>
  }

  // Get all numeric keys from data (exclude 'month' and other string fields)
  const dataKeys = Object.keys(chartData.data[0] || {}).filter(
    (key) => key !== 'month' && typeof chartData.data[0][key] === 'number'
  )

  if (chartData.chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ fill: colors[index % colors.length], r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // Bar chart
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData.data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            radius={[8, 8, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

const ChartsSection: React.FC = () => {
  const dispatch = useDispatch()
  const { items: charts, loading, error } = useSelector((state: RootState) => state.charts)
  const { admin } = useSelector((state: RootState) => state.auth)

  // Fetch charts on component mount
  useEffect(() => {
    const fetchCharts = async () => {
      if (!admin?.id) return

      dispatch(setChartsLoading(true))
      try {
        const chartData = await fetchChartsByAdmin(admin.id)
        dispatch(setCharts(chartData))
      } catch (err) {
        dispatch(setChartsError(err instanceof Error ? err.message : 'Failed to fetch charts'))
      }
    }

    fetchCharts()
  }, [admin?.id, dispatch])

  if (loading) {
    return (
      <section className="charts-section">
        <div className="loading-message">Loading charts...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="charts-section">
        <div className="error-message">Error: {error}</div>
      </section>
    )
  }

  if (charts.length === 0) {
    return (
      <section className="charts-section">
        <div className="no-data-message">No charts available. Create charts in the admin panel.</div>
      </section>
    )
  }

  return (
    <section className="charts-section">
      <div className="charts-container">
        {charts.map((chart) => (
          <div key={chart._id} className="chart-wrapper">
            <h3>{chart.chartName}</h3>
            <ChartDisplay chartData={chart} colors={CHART_COLORS} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ChartsSection
