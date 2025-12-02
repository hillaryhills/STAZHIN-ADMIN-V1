import { FileIcon } from "../../../icons";

export default function EmptyState({ message, onReset }: { message: string; onReset?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Icon Bubble */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800">
        <FileIcon className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-gray-800 dark:text-white">
        No Results Found
      </h3>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        {message}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="mt-5 px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition"
        >
          Reset Search
        </button>
      )}
    </div>
  );
}
