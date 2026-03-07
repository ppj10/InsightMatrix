import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import {
  createChart,
  updateChart,
  deleteChart,
  fetchChartsByAdmin,
  ChartDataPoint,
} from '../../services/api'
import { setCharts } from '../../store/slices/chartSlice'
import './ChartManagement.css'

interface ChartFormData {
  chartName: string
  chartType: 'line' | 'bar'
  data: ChartDataPoint[]
}

const ChartManagement: React.FC = () => {
  const dispatch = useDispatch()
  const { admin } = useSelector((state: RootState) => state.auth)
  const { items: charts } = useSelector((state: RootState) => state.charts)

  const [formData, setFormData] = useState<ChartFormData>({
    chartName: '',
    chartType: 'line',
    data: [{ month: '', revenue: 0, users: 0, orders: 0 }],
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Handle form changes
  const handleChartNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, chartName: e.target.value })
  }

  const handleChartTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, chartType: e.target.value as 'line' | 'bar' })
  }

  const handleDataChange = (
    index: number,
    field: keyof ChartDataPoint,
    value: string | number
  ) => {
    const newData = [...formData.data]
    if (field === 'month') {
      newData[index] = { ...newData[index], month: value as string }
    } else {
      newData[index] = { ...newData[index], [field]: Number(value) || 0 }
    }
    setFormData({ ...formData, data: newData })
  }

  const handleAddDataRow = () => {
    setFormData({
      ...formData,
      data: [...formData.data, { month: '', revenue: 0, users: 0, orders: 0 }],
    })
  }

  const handleRemoveDataRow = (index: number) => {
    setFormData({
      ...formData,
      data: formData.data.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!admin?.id) {
      setMessage({ type: 'error', text: 'Admin ID not found' })
      return
    }

    if (!formData.chartName) {
      setMessage({ type: 'error', text: 'Chart name is required' })
      return
    }

    if (formData.data.length === 0) {
      setMessage({ type: 'error', text: 'At least one data point is required' })
      return
    }

    try {
      if (editingId) {
        await updateChart(editingId, {
          chartName: formData.chartName,
          chartType: formData.chartType,
          data: formData.data,
        })

        // Refresh charts
        const chartData = await fetchChartsByAdmin(admin.id)
        dispatch(setCharts(chartData))

        setMessage({ type: 'success', text: 'Chart updated successfully' })
        setEditingId(null)
      } else {
        await createChart({
          adminId: admin.id,
          chartName: formData.chartName,
          chartType: formData.chartType,
          data: formData.data,
        })
        
        // Refresh charts to ensure UI updates
        const chartData = await fetchChartsByAdmin(admin.id)
        dispatch(setCharts(chartData))
        
        setMessage({ type: 'success', text: 'Chart created successfully' })
      }

      // Reset form
      setFormData({
        chartName: '',
        chartType: 'line',
        data: [{ month: '', revenue: 0, users: 0, orders: 0 }],
      })

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Operation failed',
      })
    }
  }

  const handleEdit = (chartId: string) => {
    const chart = charts.find((c) => c._id === chartId)
    if (chart) {
      setFormData({
        chartName: chart.chartName,
        chartType: chart.chartType,
        data: chart.data,
      })
      setEditingId(chartId)
    }
  }

  const handleDelete = async (chartId: string) => {
    if (!window.confirm('Are you sure you want to delete this chart?')) return

    if (!admin?.id) return

    try {
      await deleteChart(chartId)
      
      // Refresh charts to ensure UI updates
      const chartData = await fetchChartsByAdmin(admin.id)
      dispatch(setCharts(chartData))
      
      setMessage({ type: 'success', text: 'Chart deleted successfully' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Delete failed',
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      chartName: '',
      chartType: 'line',
      data: [{ month: '', revenue: 0, users: 0, orders: 0 }],
    })
    setEditingId(null)
  }

  return (
    <div className="chart-management">
      <h2>Manage Charts</h2>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="chart-management-content">
        <div className="chart-form-section">
          <h3>{editingId ? 'Edit Chart' : 'Create New Chart'}</h3>

          <form onSubmit={handleSubmit} className="chart-form">
            <div className="form-group">
              <label htmlFor="chartName">Chart Name</label>
              <input
                id="chartName"
                type="text"
                value={formData.chartName}
                onChange={handleChartNameChange}
                placeholder="e.g., Revenue Trend"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="chartType">Chart Type</label>
              <select value={formData.chartType} onChange={handleChartTypeChange}>
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>

            <div className="data-section">
              <h4>Chart Data</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th>Users</th>
                    <th>Orders</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.data.map((point, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={point.month}
                          onChange={(e) => handleDataChange(index, 'month', e.target.value)}
                          placeholder="Jan"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={point.revenue}
                          onChange={(e) => handleDataChange(index, 'revenue', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={point.users}
                          onChange={(e) => handleDataChange(index, 'users', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={point.orders}
                          onChange={(e) => handleDataChange(index, 'orders', e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleRemoveDataRow(index)}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button type="button" onClick={handleAddDataRow} className="btn-secondary">
                Add Data Row
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Chart' : 'Create Chart'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="chart-list-section">
          <h3>Existing Charts</h3>
          {charts.length > 0 ? (
            <div className="chart-list">
              {charts.map((chart) => (
                <div key={chart._id} className="chart-item">
                  <div className="chart-item-header">
                    <div>
                      <h4>{chart.chartName}</h4>
                      <p className="chart-type">Type: {chart.chartType}</p>
                    </div>
                    <div className="chart-item-actions">
                      <button
                        onClick={() => handleEdit(chart._id)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(chart._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="chart-item-data">
                    <p>Data Points: {chart.data.length}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-charts">No charts created yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChartManagement
