interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav className="flex items-center justify-center gap-2 py-6" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrev}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
      >
        Previous
      </button>

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
      >
        Next
      </button>
    </nav>
  );
}