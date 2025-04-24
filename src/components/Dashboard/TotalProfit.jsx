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
const TotalProfit = ({ isDark, data,title,icon }) => {

    
    const bgColor = isDark ? "bg-gray-800" : "bg-white";
    const textColor = isDark ? "text-gray-200" : "text-gray-800";
    const secondaryTextColor = isDark ? "text-gray-400" : "text-gray-500";
    
    const change=1.2
    const isPositive=true

    console.log("data1",data)
    console.log("title",title)
 

    const calculatePL=(trades)=>{
        let total = 0;
     
         for (let i = 0; i < trades.length; i++) {

            
             total += trades[i].profit_loss;
         }
        return total;
    }

   let value=''
        if( title=='Total Trades'){
           value =data.length ;
        }
    else if(title=='Net P&L'){
        value = '$'+ calculatePL(data);
        
    }
     
    else if(title=='Win Rate'){
        value = ((data.filter(trade => trade.profit_loss > 0).length / data.length) * 100).toFixed(2) + '%';
    }
    else  if(title=='Average Profit/Loss'){

        value = '$'+ (calculatePL(data)/data.length).toFixed(2);
    }
    else if(title=='Average Holding Time'){
        value = ((data.filter(trade => trade.profit_loss > 0).length / data.length) * 100).toFixed(2) + ' days';
    }
    else if(title=='Best/Worst Trade'){
        const bestTrade = Math.max(...data.map(trade => trade.profit_loss));
        const worstTrade = Math.min(...data.map(trade => trade.profit_loss));
        value = `$${bestTrade} / $${worstTrade}`;
    }
    else if(title === 'Risk-Reward Ratio') {
        
    
        value = "1:1"
    }
    
    
    else if(title=='Max Drawdown'){
        const maxDrawdown = Math.min(...data.map(trade => trade.profit_loss));
        value = `$${maxDrawdown}`;
       
    }


    
    return (
        <div>
           
            <div className={`${bgColor} rounded-lg shadow p-4`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-sm font-medium ${secondaryTextColor}`}>{title}</h3>
              {icon}
            </div>
            <div className="flex items-baseline">
              <p className={`text-xl font-semibold ${textColor}`}>{value}</p>
              {change && (
                <span className={`ml-2 text-sm flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                  {change}
                </span>
              )}
              </div>
            </div>
          </div>
        
    

    );


};

export default TotalProfit;