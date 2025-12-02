import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
//   if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const generatePages = () => {
    const pages: number[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push(-1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push(-2);

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">

      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md border text-sm
          ${currentPage === 1 ? "bg-brand-950 text-brand-25 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {generatePages().map((num, index) =>
        num < 0 ? (
          <span key={index} className="px-2 text-gray-400">…</span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(num)}
            className={`px-3 py-1 rounded-md border text-sm transition
              ${currentPage === num
                ? "bg-brand-950 text-white border-brand-950"
                : "bg-white hover:bg-gray-100 border-brand-950"
              }`}
          >
            {num}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md border text-sm border-brand-950
          ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
