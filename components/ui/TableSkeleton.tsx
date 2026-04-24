type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export function TableSkeleton({
  rows = 5,
  columns = 4,
}: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto border-t border-[var(--color-line)]">
      <div className="min-w-full animate-pulse">
        <div className="grid border-b border-[var(--color-line)] py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={`head-${index}`}
              className="mx-3 h-3 bg-[rgba(17,22,29,0.08)]"
            />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid border-b border-[rgba(17,22,29,0.08)] py-5"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <div
                key={`cell-${rowIndex}-${columnIndex}`}
                className="mx-3 h-4 bg-[rgba(17,22,29,0.08)]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
