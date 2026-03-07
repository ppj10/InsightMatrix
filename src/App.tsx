import React from 'react'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { logout } from './store/slices/authSlice'
import Login from './features/auth/Login'
import MetricsSection from './features/metrics/MetricsSection'
import ChartsSection from './features/charts/ChartsSection'
import UsersSection from './features/users/UsersSection'
import './App.css'

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const admin = useAppSelector((state) => state.auth.admin)
  const metricsLoading = useAppSelector(
    (state) => state.metrics.loading
  )
  const usersLoading = useAppSelector((state) => state.users.loading)

  const handleLogout = () => {
    dispatch(logout())
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>InsightMatrix</h1>
            <p>Analytics Dashboard</p>
          </div>
          <div className="header-user">
            <span className="user-name">{admin?.name}</span>
            <button onClick={handleLogout} className="logout-button" aria-label="Logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <MetricsSection />
        <ChartsSection />
        <UsersSection />
      </main>

      {(metricsLoading || usersLoading) && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  )
}

export default App
