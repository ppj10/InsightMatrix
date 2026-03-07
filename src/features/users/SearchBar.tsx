import React, { useCallback } from 'react'
import './SearchBar.css'

interface SearchBarProps {
  value: string
  onChange: (term: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={value}
        onChange={handleChange}
        className="search-input"
      />
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    </div>
  )
}

export default React.memo(SearchBar)
