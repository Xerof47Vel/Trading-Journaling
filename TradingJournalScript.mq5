//+------------------------------------------------------------------+
//| Script to fetch trade history and send it in one request         |
//+------------------------------------------------------------------+
#property strict
// Define the URL of the backend server
string serverURL = "https://webhook.site/142b7915-2589-4f85-b070-5cac355eb13e"; // Change this to your actual server URL
string apiKey = "your-api-key";  // Optional: API key for authentication

//+------------------------------------------------------------------+
//| The main function that runs when the script is executed          |
//+------------------------------------------------------------------+
void OnStart()
{
    // Select all history from beginning of time to current time
    bool selected = HistorySelect(0, TimeCurrent());
    if(!selected) {
        Print("Error selecting history!");
        return;
    }
    
    // Get total number of deals in the history
    int totalDeals = HistoryDealsTotal();
    Print("Total deals found: ", totalDeals);
    
    string allTradesJson = "[";  // Start JSON array for trades
    string allDepositsWithdrawalsJson = "["; // Start JSON array for deposits and withdrawals
    
    int tradesAdded = 0;
    int transAdded = 0;
    long account_number = AccountInfoInteger(ACCOUNT_LOGIN);
    
    // Fetch current balance (this will be added once at the first level)
    double currentBalance = AccountInfoDouble(ACCOUNT_BALANCE);  // Fetch the current balance of the account
    
    for(int i = 0; i < totalDeals; i++) {
        ulong dealTicket = HistoryDealGetTicket(i);
        
        if(dealTicket != 0) {
            // Check if this is a trade deal (not a balance operation, etc.)
            long dealEntry = HistoryDealGetInteger(dealTicket, DEAL_ENTRY);
            if(dealEntry != DEAL_ENTRY_IN && dealEntry != DEAL_ENTRY_OUT) continue;
            
            // Fetch deal details
            double profitLoss = HistoryDealGetDouble(dealTicket, DEAL_PROFIT);
            string commodity = HistoryDealGetString(dealTicket, DEAL_SYMBOL);
            double lots = HistoryDealGetDouble(dealTicket, DEAL_VOLUME);
            double entryPrice = HistoryDealGetDouble(dealTicket, DEAL_PRICE);
            
            // Get deal type
            long dealType = HistoryDealGetInteger(dealTicket, DEAL_TYPE);
            string action = (dealType == DEAL_TYPE_BUY) ? "BUY" : "SELL";
            
            // Get deal time
            datetime dealTime = (datetime)HistoryDealGetInteger(dealTicket, DEAL_TIME);
            string time = TimeToString(dealTime, TIME_DATE | TIME_SECONDS);
            
            // Fetch exit price, stop loss, and take profit if it's a closing deal
            double exitPrice = 0.0;
            double stopLoss = HistoryDealGetDouble(dealTicket, DEAL_SL);
            double takeProfit = HistoryDealGetDouble(dealTicket, DEAL_TP);
            
            // Only capture exit price for closed deals (DEAL_ENTRY_OUT)
            if (dealEntry == DEAL_ENTRY_OUT) {
                exitPrice = HistoryDealGetDouble(dealTicket, DEAL_PRICE);
            }
            
            // Add trade to JSON array if it's a valid trade
            if (lots > 0.0 && entryPrice > 0.0 && commodity != "" && profitLoss != 0.0) {
                if(tradesAdded > 0) {
                    allTradesJson += ",";
                }
                
                string tradeData = StringFormat(
                    "{\"commodity\":\"%s\", \"accountNumber\":\"%I64d\", \"profitLoss\":%.2f, \"lotSize\":%.2f, \"entryPrice\":%.5f, \"exitPrice\":%.5f, \"stopLoss\":%.5f, \"takeProfit\":%.5f, \"tradeType\":\"%s\", \"time\":\"%s\", \"ticket\":%llu}",
                    commodity, account_number, profitLoss, lots, entryPrice, exitPrice, stopLoss, takeProfit, action, time, dealTicket
                );
                
                allTradesJson += tradeData;
                tradesAdded++;
                Print("Processed deal: ", dealTicket);
            }
            
            if (dealType == DEAL_TYPE_BALANCE) {
                double amount = HistoryDealGetDouble(dealTicket, DEAL_PROFIT);
                string comment = HistoryDealGetString(dealTicket, DEAL_COMMENT);  // sometimes contains "Deposit", "Withdrawal"
                string time = TimeToString((datetime)HistoryDealGetInteger(dealTicket, DEAL_TIME), TIME_DATE | TIME_SECONDS);

                string action = (amount >= 0) ? "DEPOSIT" : "WITHDRAWAL";
                if(transAdded > 0) {
                    allDepositsWithdrawalsJson += ",";
                }
                string depositJson = StringFormat(
                    "{\"accountNumber\":\"%I64d\", \"type\":\"%s\", \"amount\":%.2f, \"time\":\"%s\", \"ticket\":%llu, \"comment\":\"%s\"}",
                    account_number, action, amount, time, dealTicket, comment
                );
                allDepositsWithdrawalsJson += depositJson;
                transAdded++;
                
                Print("Processed deal: ", dealTicket);
                // Add to a new deposits/withdrawals array or send to your backend
                Print("Deposit/Withdrawal detected: ", depositJson);
            }
        }
    }
    
    allDepositsWithdrawalsJson += "]";
    allTradesJson += "]";
    
    // Wrap everything in a final JSON structure
    string data = StringFormat("{\"body\":{\"currentBalance\":%.2f, \"transactions\":%s, \"trades\":%s}, \"type\":\"meta_Trader_insert\"}", currentBalance, allDepositsWithdrawalsJson, allTradesJson);
    
    Print("Total trades collected: ", data);
    
    // Only send if we have trades to send
    if(tradesAdded > 0 || transAdded > 0) {
        // Send all trade data in one request
        SendAllTradesToServer(data);
    } else {
        Print("No trades found to send.");
    }
    
    Print("Trade history processing complete!");
}

//+------------------------------------------------------------------+
//| Function to send all trades in a single request                  |
//+------------------------------------------------------------------+
void SendAllTradesToServer(string data)
{
    // Create an HTTP request object
    char postData[];
    StringToCharArray(data, postData);
    
    // Define headers
    string headers = "Content-Type: application/json\r\n";
    if(apiKey != "") {
        headers += "Authorization: Bearer " + apiKey + "\r\n";
    }
    
    // Log the size of data being sent
    Print("Sending ", ArraySize(postData), " bytes of trade data");
    
    // We'll also write to a file as a backup in case WebRequest fails
    string filename = "trades_backup_" + TimeToString(TimeCurrent(), TIME_DATE | TIME_SECONDS) + ".json";
    filename = StringReplace(filename, ":", "-");
    int fileHandle = FileOpen(filename, FILE_WRITE | FILE_TXT);
    if(fileHandle != INVALID_HANDLE) {
        FileWriteString(fileHandle, data);
        FileClose(fileHandle);
        Print("Backup saved to file: ", filename);
    }
    
    // Send the POST request to the backend
    char result[];
    string result_headers;
    int timeout = 10000; // 10 seconds timeout (increased for larger payload)
    
    // WebRequest function call with proper parameter order
    int res = WebRequest(
        "POST",                // method
        serverURL,             // URL
        headers,               // headers
        timeout,               // timeout
        postData,              // data to send
        result,                // result
        result_headers         // response headers
    );
    
    if(res != -1) {
        // Convert result to string for display
        string resultStr = "";
        int size = ArraySize(result);
        if(size > 0) {
            resultStr = CharArrayToString(result, 0, MathMin(size, 100)) + (size > 100 ? "..." : "");
        }
        
        Print("All trade data sent successfully! Server response: ", resultStr);
    } else {
        int errorCode = GetLastError();
        Print("Failed to send trade data. Error code: ", errorCode, " Description: ", ErrorDescription(errorCode));
        Print("Data has been saved to file as backup.");
    }
}

//+------------------------------------------------------------------+
//| Helper function to return error description                      |
//+------------------------------------------------------------------+
string ErrorDescription(int error_code)
{
    switch(error_code) {
        case 4014: return "Function not allowed in testing mode";
        case 4060: return "No connection to the trade server";
        case 5200: return "URL format error";
        case 5201: return "Failed to connect to specified URL";
        case 5202: return "Timeout exceeded";
        case 5203: return "HTTP request failed";
        default: return "Unknown error";
    }
}
