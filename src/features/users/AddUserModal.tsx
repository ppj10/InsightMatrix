import React, { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addUser, setUsersError } from '../../store/slices/usersSlice'
import { createUser } from '../../services/api'
import './AddUserModal.css'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch()
  const adminId = useAppSelector((state) => state.auth.admin?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'active' as 'active' | 'inactive',
  })

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      // Validation
      if (!formData.name.trim()) {
        setError('Name is required')
        return
      }
      if (!formData.email.trim()) {
        setError('Email is required')
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email')
        return
      }
      if (!adminId) {
        setError('Admin ID is missing')
        return
      }

      setLoading(true)

      try {
        const newUser = await createUser({
          name: formData.name,
          email: formData.email,
          status: formData.status,
          adminId,
        })

        // Convert MongoDB response to app format
        dispatch(
          addUser({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            joinDate: newUser.joinDate,
            status: newUser.status,
            adminId: newUser.adminId,
          })
        )

        // Reset form and close modal
        setFormData({ name: '', email: '', status: 'active' })
        onClose()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create user'
        setError(message)
        dispatch(setUsersError(message))
      } finally {
        setLoading(false)
      }
    },
    [formData, adminId, dispatch, onClose]
  )

  const handleDismissError = useCallback(() => {
    setError(null)
  }, [])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New User</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">
          {error && (
            <div className="error-message">
              <span>{error}</span>
              <button
                type="button"
                onClick={handleDismissError}
                className="error-close"
              >
                ×
              </button>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="form-input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="button button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="button button-primary"
            >
              {loading ? 'Adding User...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserModal
