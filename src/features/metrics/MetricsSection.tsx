import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import MetricsCard from './MetricsCard'
import './MetricsSection.css'

interface CalculatedMetric {
  id: string
  label: string
  value: number
  change: number
  trend: 'up' | 'down'
  displayValue: string
}

const MetricsSection: React.FC = () => {
  const charts = useSelector((state: RootState) => state.charts.items)

  // Calculate metrics from chart data
  const memoizedMetrics = useMemo(() => {
    if (!charts || charts.length === 0) {
      return []
    }

    // Aggregate all data points from all charts
    const allDataPoints: Array<{ revenue?: number; users?: number; orders?: number }> = []
    charts.forEach((chart) => {
      if (chart.data && Array.isArray(chart.data)) {
        allDataPoints.push(...chart.data)
      }
    })

    if (allDataPoints.length === 0) {
      return []
    }

    // Calculate totals and averages
    const totalRevenue = allDataPoints.reduce((sum, point) => sum + (point.revenue || 0), 0)
    const totalUsers = allDataPoints.reduce((sum, point) => sum + (point.users || 0), 0)
    const totalOrders = allDataPoints.reduce((sum, point) => sum + (point.orders || 0), 0)
    const avgRevenue = Math.round(totalRevenue / allDataPoints.length)

    // Calculate trends (simple: compare first vs last data point)
    const firstPoint = allDataPoints[0]
    const lastPoint = allDataPoints[allDataPoints.length - 1]

    const revenueTrend = (lastPoint.revenue || 0) >= (firstPoint.revenue || 0) ? 'up' : 'down'
    const usersTrend = (lastPoint.users || 0) >= (firstPoint.users || 0) ? 'up' : 'down'
    const ordersTrend = (lastPoint.orders || 0) >= (firstPoint.orders || 0) ? 'up' : 'down'
    const avgTrend = avgRevenue >= (firstPoint.revenue || 0) ? 'up' : 'down'

    // Calculate change percentages
    const revenueChange =
      (firstPoint.revenue || 0) !== 0
        ? (((lastPoint.revenue || 0) - (firstPoint.revenue || 0)) / (firstPoint.revenue || 1)) * 100
        : 0
    const usersChange =
      (firstPoint.users || 0) !== 0
        ? (((lastPoint.users || 0) - (firstPoint.users || 0)) / (firstPoint.users || 1)) * 100
        : 0
    const ordersChange =
      (firstPoint.orders || 0) !== 0
        ? (((lastPoint.orders || 0) - (firstPoint.orders || 0)) / (firstPoint.orders || 1)) * 100
        : 0
    const avgChange =
      (firstPoint.revenue || 0) !== 0
        ? ((avgRevenue - (firstPoint.revenue || 0)) / (firstPoint.revenue || 1)) * 100
        : 0

    const metrics: CalculatedMetric[] = [
      {
        id: '1',
        label: 'Total Revenue',
        value: totalRevenue,
        change: Math.round(revenueChange * 10) / 10,
        trend: revenueTrend as 'up' | 'down',
        displayValue: totalRevenue.toLocaleString('en-US'),
      },
      {
        id: '2',
        label: 'Active Users',
        value: totalUsers,
        change: Math.round(usersChange * 10) / 10,
        trend: usersTrend as 'up' | 'down',
        displayValue: totalUsers.toLocaleString('en-US'),
      },
      {
        id: '3',
        label: 'Total Orders',
        value: totalOrders,
        change: Math.round(ordersChange * 10) / 10,
        trend: ordersTrend as 'up' | 'down',
        displayValue: totalOrders.toLocaleString('en-US'),
      },
      {
        id: '4',
        label: 'Avg Revenue/Point',
        value: avgRevenue,
        change: Math.round(avgChange * 10) / 10,
        trend: avgTrend as 'up' | 'down',
        displayValue: avgRevenue.toLocaleString('en-US'),
      },
    ]

    return metrics
  }, [charts])

  return (
    <section className="metrics-section">
      <h2 className="section-title">Key Metrics</h2>
      <div className="metrics-grid">
        {memoizedMetrics.length > 0 ? (
          memoizedMetrics.map((metric) => (
            <MetricsCard key={metric.id} metric={metric} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
            No chart data available. Create charts in the admin panel to see metrics.
          </div>
        )}
      </div>
    </section>
  )
}

export default MetricsSection
