import React from 'react';
import Select from 'react-select';
import { ChartCandlestick } from 'lucide-react'; // Make sure this is imported correctly

const AccountDropdown = ({ accounts, handleAccountChange, isDark }) => {
  const accountOptions = accounts.map(account => ({
    value: account.account_number,
    label: (
      <div className="flex items-center">
        <ChartCandlestick className="mr-2" size={20} /> {/* Icon here */}
        {account.broker_name} ({account.account_number})
      </div>
    ),
  }));

  return (
    <Select
      options={accountOptions}
      onChange={handleAccountChange}
      className={`react-select-container ${isDark ? 'dark' : 'light'}`}
      classNamePrefix="react-select"
    />
  );
};

export default AccountDropdown;
