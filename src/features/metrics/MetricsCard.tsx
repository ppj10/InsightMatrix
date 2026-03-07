import React from 'react'
import { Metric } from '../../store/slices/metricsSlice'
import './MetricsCard.css'

interface MetricsCardProps {
  metric: Metric & { displayValue: string }
}

const MetricsCard: React.FC<MetricsCardProps> = ({ metric }) => {
  return (
    <div className="metrics-card">
      <div className="metrics-card-header">
        <h3>{metric.label}</h3>
        <span className={`badge ${metric.trend}`}>
          {metric.trend === 'up' ? '↑' : '↓'} {Math.abs(metric.change)}%
        </span>
      </div>
      <div className="metrics-card-value">{metric.displayValue}</div>
      <div className={`metrics-card-trend trend-${metric.trend}`}>
        {metric.trend === 'up' ? 'Increase' : 'Decrease'} from last period
      </div>
    </div>
  )
}

export default React.memo(MetricsCard)
