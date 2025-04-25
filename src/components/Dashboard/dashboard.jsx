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
;




  useEffect(() => {
    const getAccounts = async () => {
      try {
        const response = await axios.post(
          "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/getTrades",
          {
            type: "get_user_trading_accounts",
            body: { userId: 1 },//later we will get the userId from the login page
          }
        );

        const data = JSON.parse(response.data.body);
 
    localStorage.setItem("accounts", JSON.stringify(data.accounts));

  
      
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    getAccounts();
  }, []);



  return (
      <div>
         <BodyContent isDark={props.isDark}/>
      </div>
  );



};

export default Dashboard;