import React from 'react';
import {
 
    ArrowUp,
    ArrowDown,

  } from "lucide-react";




const RecentTrades = ({trade, isDark}) => {
 
const textColor = isDark ? "text-gray-200" : "text-gray-800";
const secondaryTextColor =  isDark ? "text-gray-400" : "text-gray-500";
yea
const hoverBgColor = isDark ? "hover:bg-gray-700" : "hover:bg-gray-50";
    return (
        <>
         <div key={trade.id} className={`p-3 ${hoverBgColor}`}>
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                              ${trade.trade_type === 'BUY' 
                                ? isDark ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'
                                : isDark ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'}`}>
                              {trade.action === 'BUY' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className={`font-medium ${textColor}`}>{trade.commodity}</p>
                                <span className={`font-medium ${trade.profit_loss>0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {"$"+trade.profit_loss}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <p className={`text-xs ${secondaryTextColor}`}>{trade.lot_size} @ {trade.entry_price}</p>
                                <p className={`text-xs ${secondaryTextColor}`}>{trade.open_date}</p>
                              </div>
                            </div>
                          </div>
                        </div></>
    );
};

export default RecentTrades;