interface InventoryItem {
  id: number;
  bloodGroup: string;
  quantity: number;
  lastUpdated: string;
}

interface Transaction {
  id: number;
  bloodGroup: string;
  quantity: number;
  type: 'DONATION' | 'REQUEST';
  timestamp: string;
  transactionType: string;
  remarks: string;
}

interface InventoryStatsProps {
  lowStock: InventoryItem[];
  recentTransactions: Transaction[];
}

export default function InventoryStats({ lowStock, recentTransactions }: InventoryStatsProps) {
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.error('Invalid timestamp:', timestamp);
        return 'Invalid Date';
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Reset time part for date comparison
      const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayWithoutTime = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

      if (dateWithoutTime.getTime() === todayWithoutTime.getTime()) {
        return `Today at ${date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}`;
      } else if (dateWithoutTime.getTime() === yesterdayWithoutTime.getTime()) {
        return `Yesterday at ${date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}`;
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error, 'Timestamp:', timestamp);
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Low Stock Alert</h2>
        {lowStock.length > 0 ? (
          <div className="space-y-3">
            {lowStock.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md"
              >
                <div>
                  <span className="font-medium text-red-700">{item.bloodGroup}</span>
                  <p className="text-sm text-red-600">{item.quantity} units left</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">All blood groups are well-stocked</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-3 ${
                transaction.type === 'DONATION'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-blue-50 border border-blue-200'
              } rounded-md`}
            >
              <div>
                <div className="flex items-center">
                  <span className={`font-medium ${
                    transaction.type === 'DONATION' ? 'text-green-700' : 'text-blue-700'
                  }`}>
                    {transaction.bloodGroup}
                  </span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    transaction.type === 'DONATION'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>{transaction.quantity} units</div>
                  <div className="text-xs">
                    {transaction.timestamp ? formatDate(transaction.timestamp) : 'No date available'}
                  </div>
                  {transaction.remarks && (
                    <div className="text-xs text-gray-500 mt-1">{transaction.remarks}</div>
                  )}
                </div>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                transaction.type === 'DONATION' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {transaction.type === 'DONATION' ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
