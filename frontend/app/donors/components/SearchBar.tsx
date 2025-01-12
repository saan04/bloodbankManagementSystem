interface SearchBarProps {
  onSearch: (term: string, bloodGroup: string) => void;
  searchTerm: string;
  selectedBloodGroup: string;
}

export default function SearchBar({ onSearch, searchTerm, selectedBloodGroup }: SearchBarProps) {
  const bloodGroups = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value, selectedBloodGroup)}
        />
      </div>
      <div className="sm:w-48">
        <select
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={selectedBloodGroup}
          onChange={(e) => onSearch(searchTerm, e.target.value)}
        >
          <option value="">All Blood Groups</option>
          {bloodGroups.slice(1).map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
