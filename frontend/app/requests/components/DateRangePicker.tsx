interface DateRangePickerProps {
  dateRange: { start: string; end: string } | null;
  onDateRangeChange: (dateRange: { start: string; end: string } | null) => void;
}

export default function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="datetime-local"
            className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            value={dateRange?.start || ''}
            onChange={(e) =>
              onDateRangeChange({
                start: e.target.value,
                end: dateRange?.end || '',
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="datetime-local"
            className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            value={dateRange?.end || ''}
            onChange={(e) =>
              onDateRangeChange({
                start: dateRange?.start || '',
                end: e.target.value,
              })
            }
          />
        </div>
      </div>

      <button
        onClick={() => onDateRangeChange(null)}
        className="w-full mt-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
      >
        Clear Date Range
      </button>
    </div>
  );
}
