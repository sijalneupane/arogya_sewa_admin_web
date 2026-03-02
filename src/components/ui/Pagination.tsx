export interface PaginationProps {
  currentPage: number;
  totalPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

/**
 * Reusable Pagination component for table pagination.
 * Displays page numbers with Previous/Next navigation.
 * 
 * @param currentPage - Current active page number
 * @param totalPage - Total number of pages
 * @param totalRecords - Total number of records
 * @param onPageChange - Callback when page is changed
 */
export function Pagination({
  currentPage,
  totalPage,
  totalRecords,
  onPageChange,
}: PaginationProps) {
  if (totalPage <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Showing page {currentPage} of {totalPage} ({totalRecords} total records)
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              currentPage === page
                ? 'bg-primary text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPage}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
