import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Flag, 
  BarChart2, 
  Clock, 
  AlertTriangle,
  Image as ImageIcon
} from "lucide-react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const TradeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const trade = location.state?.trade || null;
  console.log("Trade data from location:", trade);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTradeDuration = () => {
    if (!trade?.openDate || !trade?.closeDate) return "-";
    
    const openDate = new Date(trade.openDate);
    const closeDate = new Date(trade.closeDate);
    const diffTime = Math.abs(closeDate - openDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    }
  };

  const deleteTrade = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/deletetrade",
        { type: "delete_trade", body: { userId: 1, tradeId: id } }
      );
      
      if (response.status === 200) {
        navigate("/view-trades");
      } else {
        setError("Failed to delete trade");
      }
    } catch (error) {
      console.error("Error deleting trade:", error);
      setError("An error occurred while deleting the trade");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTrade = () => {
    navigate(`/edit-trade/${trade.id}`, { state: { trade } });
  };

  // Helper function to determine if a value should be displayed
  const displayIfExists = (value, defaultValue = "-") => {
    return value ? value : defaultValue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading trade details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/view-trades")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Trades
        </button>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Trade Not Found</h2>
          <p className="text-gray-500 mb-6">The trade you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate("/view-trades")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-12">
      {/* Header with navigation and actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/view-trades")}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Trades
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={handleEditTrade}
            className="inline-flex items-center px-4 py-2 border border-blue-400 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 shadow-sm transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Trade
          </button>
          <button
            onClick={() => setDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 shadow-sm transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Trade header */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 mr-3">
                  {trade.commodity}
                </h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  trade.tradeStatus === "open" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {trade.tradeStatus === "open" ? "OPEN POSITION" : "CLOSED TRADE"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                 XM ({trade.account_number})
              </p>
            </div>
            
            {trade.tradeStatus === "closed" && (
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className={`text-2xl font-bold ${parseFloat(trade.profitLoss || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {parseFloat(trade.profitLoss || 0) >= 0 ? "+" : ""}{parseFloat(trade.profitLoss || 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  {trade.strategy && `Strategy: ${trade.strategy}`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trade info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Column 1: Trade basics */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trade Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 shadow-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Direction</span>
                  <span className={`font-medium ${trade.tradeType === "buy" ? "text-green-600" : "text-red-600"}`}>
                    {trade.tradeType === "buy" ? "LONG" : "SHORT"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lot Size</span>
                  <span className="font-medium">{trade.lot_size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Entry Price</span>
                  <span className="font-medium">{displayIfExists(trade.entry_price)}</span>
                </div>
                {trade.tradeStatus === "closed" && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Exit Price</span>
                    <span className="font-medium">{displayIfExists(trade.exit_price)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Stop Loss</span>
                  <span className="font-medium">{displayIfExists(trade.stop_loss)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Take Profit</span>
                  <span className="font-medium">{displayIfExists(trade.take_profit)}</span>
                </div>
                {trade.riskReward && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Risk/Reward</span>
                    <span className="font-medium">{trade.riskReward}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Timeline
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 shadow-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Open Date</span>
                  <span className="font-medium">{formatDate(trade.open_date)}</span>
                </div>
                {trade.tradeStatus === "closed" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Close Date</span>
                      <span className="font-medium">{formatDate(trade.close_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-medium">{calculateTradeDuration()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Column 2: Account impact */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                <BarChart2 className="h-4 w-4 mr-2" />
                Account Performance
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 shadow-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Equity Before</span>
                  <span className="font-medium">{displayIfExists(trade.equity_before)}</span>
                </div>
                {trade.tradeStatus === "closed" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Equity After</span>
                      <span className="font-medium">{displayIfExists(trade.equity_after)}</span>
                    </div>
                    
                    {trade.equity_before && trade.equity_after && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Change</span>
                        <span className={`font-medium ${parseFloat(trade.equity_after) - parseFloat(trade.equity_before) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {((parseFloat(trade.equity_after) - parseFloat(trade.equity_before)) / parseFloat(trade.equity_before) * 100).toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {trade.tags && trade.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                  <Flag className="h-4 w-4 mr-2" />
                  Tags
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex flex-wrap gap-2">
                    {trade.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {trade.strategy && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                  <Activity className="h-4 w-4 mr-2" />
                  Strategy
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700">{trade.strategy}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Column 3: Analysis and visuals */}
          <div className="space-y-6">
            {/* Trade Screenshot - New dedicated section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                <ImageIcon className="h-4 w-4 mr-2" />
                Trade Chart
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                
              {trade.trade_images && trade.trade_images !== "" ? (
  <div>
    <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
      <ImageIcon className="h-4 w-4 mr-2" />
      Chart / Screenshot
    </h3>
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm flex items-center justify-center">
      {(() => {
        const cleanUrl = trade.trade_images.replace(/^"(.*)"$/, "$1");

        const isTradingView = cleanUrl.includes("tradingview.com");

        if (isTradingView) {
          return (
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View Chart on TradingView
            </a>
          );
        } else {
          return (
            <img
              src={cleanUrl}
              alt="Trade Chart"
              className="rounded-lg max-w-full h-auto"
            />
          );
        }
      })()}
    </div>
  </div>
) : (
  <div>
    <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
      <ImageIcon className="h-4 w-4 mr-2" />
      Chart / Screenshot
    </h3>
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm flex items-center justify-center">
      <p className="text-gray-500 text-sm">No chart available for this trade.</p>
    </div>
  </div>
)}

              </div>
            </div>
            
            {trade.comments && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Trade Analysis
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 whitespace-pre-line">{trade.comments}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Trade</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this trade? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteTrade}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Image modal for enlarged view */}
      {imageModalOpen && trade.tradeLink && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-2">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setImageModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-center">
              <img 
                src={trade.tradeLink} 
                alt="Trade chart" 
                className="max-h-[75vh] max-w-full rounded-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/api/placeholder/800/600";
                  e.target.alt = "Image not available";
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeDetail;