import React, { useState, useEffect } from 'react';

const Transactions = () => {
  const [interval, setInterval] = useState('');
  const [whaleAccounts, setWhaleAccounts] = useState([]);
    const [loading, setLoading] = useState(false);


  const handleSetInterval = async () => {
    if (!interval || isNaN(interval)) {
      alert('Please enter a valid number');
      return;
    }
      
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/transaction/set-interval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interval: `*/${interval} * * * *` }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Interval set to ${interval} minutes successfully`);
      } else {
        alert('Failed to set interval');
      }
    } catch (error) {
      console.error('Error setting interval:', error);
      alert('An error occurred while setting the interval');
    }
  };

  const fetchWhaleAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/transaction/accounts`);
      const data = await response.json();
      if (data.success) {
        setWhaleAccounts(data.data);
      } else {
        alert('Failed to fetch whale accounts');
      }
    } catch (error) {
      console.error('Error fetching whale accounts:', error);
      alert('An error occurred while fetching the whale accounts');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWhaleAccounts();
  }, []);

  return (
    <div className="font-[RobotoMono] w-full lg:p-8 p-4 flex flex-col gap-10 bg-gray-900 min-h-screen">
      <div className="md:flex hidden items-center justify-between">
        <h1 className="text-[23px] font-extrabold bg-gradient-to-r from-[#5AB0FF] to-[#01FFC2] text-transparent bg-clip-text mt-2">
          Transactions
        </h1>
        <div className="flex items-center">
          <button className="bg-[#5AB0FF] hover:bg-[#01FFC2] text-white px-4 py-2 rounded-md">
            Connect Wallet
          </button>
        </div>
      </div>

      {/* Input box and button to set interval */}
      <div className="flex flex-col w-full items-start gap-5">
        <div className="w-full">
          <h1 className="lg:text-[23px] text-lg font-extrabold bg-gradient-to-r from-[#5AB0FF] to-[#01FFC2] text-transparent bg-clip-text">
            Set Cron Job Interval
          </h1>
          <p className="lg:text-lg text-sm font-medium text-white text-opacity-75">
            Enter the interval in minutes to update the cron job.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-white p-3 rounded-md w-40"
            placeholder="Interval in minutes"
          />
          <button
            onClick={handleSetInterval}
            className="bg-[#5AB0FF] text-white px-4 py-2 rounded-md hover:bg-[#01FFC2]"
          >
            Set Interval
          </button>
        </div>
      </div>

      {/* Whale Accounts Table */}
      <div className="w-full">
        <h2 className="lg:text-[23px] text-lg font-extrabold bg-gradient-to-r from-[#5AB0FF] to-[#01FFC2] text-transparent bg-clip-text mb-4">
          Whale Accounts
        </h2>
        {loading ? (
          <p className="text-white text-opacity-75">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr className="bg-[#5AB0FF] text-left text-white">
                  <th className="py-4 px-6">Transaction Hash</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Recipient</th>
                </tr>
              </thead>
              <tbody>
                {whaleAccounts.length > 0 ? (
                  whaleAccounts.map((account, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="py-3 px-6 border-b border-gray-700 whitespace-nowrap truncate max-w-xs">
                        {account.Transaction.Hash.slice(0, 10)}...
                      </td>
                      <td className="py-3 px-6 border-b border-gray-700">
                      {parseInt(account.Transfer.Amount).toFixed(0)}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-700 whitespace-nowrap truncate max-w-xs">
                        {account.Transfer.Sender.slice(0, 10)}...
                      </td>
                      <td className="py-3 px-6 border-b border-gray-700 whitespace-nowrap truncate max-w-xs">
                        {account.Transfer.Receiver.slice(0, 10)}...
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      No whale accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
