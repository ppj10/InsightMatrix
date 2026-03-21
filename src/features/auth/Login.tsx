import React, { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { loginSuccess, loginError, clearError } from '../../store/slices/authSlice'
import { login as apiLogin } from '../../services/api'
import Signup from './Signup'
import './Login.css'

const Login: React.FC = () => {
  const dispatch = useAppDispatch()
  const error = useAppSelector((state) => state.auth.error)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!email || !password) {
        dispatch(loginError('Please fill in all fields'))
        return
      }

      setLoading(true)

      try {
        const data = await apiLogin({ email, password })

        // Save token and update auth state
        localStorage.setItem('authToken', data.token)
        dispatch(
          loginSuccess({
            token: data.token,
            admin: data.admin,
          })
        )
      } catch (err) {
        dispatch(loginError((err as Error).message || 'Error logging in. Please try again.'))
      } finally {
        setLoading(false)
      }
    },
    [email, password, dispatch]
  )

  const handleDismissError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const toggleSignup = useCallback(() => {
    setIsSignup(!isSignup)
    dispatch(clearError())
    setEmail('')
    setPassword('')
  }, [isSignup, dispatch])

  if (isSignup) {
    return <Signup onToggle={toggleSignup} />
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">InsightMatrix</h1>
        <p className="login-subtitle">Analytics Dashboard</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
              <button
                type="button"
                onClick={handleDismissError}
                className="error-close"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button onClick={toggleSignup} className="signup-link">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

