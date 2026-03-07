import React from 'react'
import { User } from '../../store/slices/usersSlice'
import './UserTable.css'

interface UserTableProps {
  users: User[]
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Join Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.joinDate}</td>
              <td>
                <span className={`status status-${user.status}`}>
                  {user.status === 'active' ? '●' : '○'} {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="empty-state">No users found</div>
      )}
    </div>
  )
}

export default React.memo(UserTable)
