import React, { useMemo, useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setCurrentPage,
  setSearchTerm,
  setUsers,
  setUsersLoading,
  setUsersError,
} from '../../store/slices/usersSlice'
import { fetchUsersByAdmin } from '../../services/api'
import UserTable from './UserTable.tsx'
import Pagination from './Pagination.tsx'
import SearchBar from './SearchBar.tsx'
import AddUserModal from './AddUserModal.tsx'
import ChartManagement from './ChartManagement.tsx'
import './UsersSection.css'

const UsersSection: React.FC = () => {
  const dispatch = useAppDispatch()
  const allUsers = useAppSelector((state) => state.users.items)
  const currentPage = useAppSelector((state) => state.users.currentPage)
  const pageSize = useAppSelector((state) => state.users.pageSize)
  const searchTerm = useAppSelector((state) => state.users.searchTerm)
  const adminId = useAppSelector((state) => state.auth.admin?.id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'users' | 'charts'>('users')

  // Fetch users from API when admin changes
  useEffect(() => {
    if (adminId) {
      dispatch(setUsersLoading(true))
      fetchUsersByAdmin(adminId)
        .then((users) => {
          const mappedUsers = users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            joinDate: user.joinDate,
            status: user.status,
            adminId: user.adminId,
          }))
          dispatch(setUsers(mappedUsers))
        })
        .catch((error) => {
          dispatch(setUsersError(error.message))
        })
    }
  }, [adminId, dispatch])

  // Memoized derived state for filtered and paginated users
  const paginatedUsers = useMemo(() => {
    // Filter users by search term
    const filteredUsers = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredUsers.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = filteredUsers.slice(
      startIndex,
      startIndex + pageSize
    )

    return {
      users: paginatedData,
      totalPages,
      totalUsers: filteredUsers.length,
    }
  }, [allUsers, currentPage, pageSize, searchTerm])

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  return (
    <section className="users-section">
      <div className="section-header">
        <h2 className="section-title">Admin Panel</h2>
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button
            className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            Chart Management
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <>
          <div className="section-header" style={{ marginTop: '20px' }}>
            <h3 className="section-subtitle">Users</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="add-user-button"
            >
              + Add User
            </button>
          </div>
          <SearchBar value={searchTerm} onChange={handleSearch} />
          <UserTable users={paginatedUsers.users} />
          <Pagination
            currentPage={currentPage}
            totalPages={paginatedUsers.totalPages}
            totalItems={paginatedUsers.totalUsers}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
          <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
      ) : (
        <ChartManagement />
      )}
    </section>
  )
}

export default UsersSection
