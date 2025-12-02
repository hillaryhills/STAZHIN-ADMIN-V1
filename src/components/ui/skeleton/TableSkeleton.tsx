export default function TableSkeleton({ rows = 6, columns = 5 }) {
  return (
    <div className="animate-pulse">
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full">
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-5 py-3">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                {Array.from({ length: columns }).map((_, j) => (
                  <td key={j} className="px-5 py-4">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
