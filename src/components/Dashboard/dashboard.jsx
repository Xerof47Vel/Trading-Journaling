import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Clock,
  DollarSign,
  PieChart,
  Scale,
  LineChart,
  Target,
  AlertCircle
} from 'lucide-react';
import BodyContent from './BodyContent.jsx';
import axios from 'axios';
import { useEffect, useState } from 'react';
import LoadingSkeleton from './LoadingSkeleton.jsx';

const Dashboard = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAccounts = async () => {
      setIsLoading(true);
      try {
        console.log("Dashboard props", props); // Properly log props

        const response = await axios.post(
          "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/getTrades",
          {
            type: "get_user_trading_accounts",
            body: { userId: 1 }, // later we will get the userId from the login page
          }
        );
        
        if (response.status !== 200) {
          throw new Error("Failed to fetch accounts data");
        }
        
        console.log("Accounts data:", response.data.body);
        const data = JSON.parse(response.data.body);
        localStorage.setItem("accounts", JSON.stringify(data.accounts));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    getAccounts();
  }, [props]); // Add props to dependency array

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-sm w-full">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <BodyContent isDark={props.isDark} />
    </div>
  );
};

export default Dashboard;