import React, { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { loginSuccess, loginError, clearError } from '../../store/slices/authSlice'
import './Signup.css'

interface SignupProps {
  onToggle: () => void
}

const Signup: React.FC<SignupProps> = ({ onToggle }) => {
  const dispatch = useAppDispatch()
  const error = useAppSelector((state) => state.auth.error)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [validationError, setValidationError] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Basic validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setValidationError('All fields are required')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setValidationError('Passwords do not match')
        return
      }

      if (formData.password.length < 6) {
        setValidationError('Password must be at least 6 characters')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setValidationError('Please enter a valid email')
        return
      }

      setValidationError('')
      setLoading(true)

      try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          dispatch(loginError(errorData.message || 'Signup failed'))
          return
        }

        const data = await response.json()

        // Save token and update auth state
        localStorage.setItem('authToken', data.token)
        dispatch(
          loginSuccess({
            token: data.token,
            admin: data.admin,
          })
        )
      } catch (err) {
        dispatch(loginError('Error signing up. Please try again.'))
      } finally {
        setLoading(false)
      }
    },
    [formData, dispatch]
  )

  const handleDismissError = useCallback(() => {
    dispatch(clearError())
    setValidationError('')
  }, [dispatch])

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join InsightMatrix to get started</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
              <button type="button" onClick={handleDismissError} className="error-dismiss">
                ✕
              </button>
            </div>
          )}

          {validationError && (
            <div className="error-message">
              <span>{validationError}</span>
              <button type="button" onClick={handleDismissError} className="error-dismiss">
                ✕
              </button>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button onClick={onToggle} className="toggle-link">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
