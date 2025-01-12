interface Donor {
  id: number;
  name: string;
  dateOfBirth: string;
  bloodGroup: string;
  phoneNumber: string;
  email: string;
  address: string;
  lastDonationDate: string | null;
  eligible: boolean;
}

interface DonorTableProps {
  donors: Donor[];
  onEdit: (donor: Donor) => void;
  onDelete: (id: number) => void;
  onDonate: (id: number) => void;
}

export default function DonorTable({ donors, onEdit, onDelete, onDonate }: DonorTableProps) {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Donation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {donors.map((donor) => (
            <tr key={donor.id}>
              <td className="px-6 py-4 whitespace-nowrap">{donor.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{calculateAge(donor.dateOfBirth)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{donor.bloodGroup}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">
                  <div>{donor.phoneNumber}</div>
                  <div className="text-gray-500">{donor.email}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {donor.lastDonationDate 
                  ? new Date(donor.lastDonationDate).toLocaleDateString()
                  : 'Never donated'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  donor.eligible 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {donor.eligible ? 'Eligible' : 'Not Eligible'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => onEdit(donor)}
                    className="px-4 py-2 text-sm border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(donor.id)}
                    className="px-4 py-2 text-sm border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                  {donor.eligible && (
                    <button
                      onClick={() => onDonate(donor.id)}
                      className="px-4 py-2 text-sm border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Record Donation
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
