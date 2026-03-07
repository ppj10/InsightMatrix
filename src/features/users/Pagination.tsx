import React, { useCallback } from 'react'
import './Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }, [currentPage, onPageChange])

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }, [currentPage, totalPages, onPageChange])

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {startItem} to {endItem} of {totalItems} users
      </div>
      <div className="pagination-controls">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="pagination-btn"
          aria-label="Previous page"
        >
          ← Previous
        </button>
        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="pagination-btn"
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default React.memo(Pagination)
