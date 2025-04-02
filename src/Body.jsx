import { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";

function Body() {
    const [getInfo, setInfo] = useState([]); 
    const [loading, setLoading] = useState(true); //// Initialize as an empty array

    const getDataFromApi = async () => {
        try {
            const response = await axios.post(
                "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/getTrades",
                { type: "get_trades", body: { userId: 1 } }, // Send JSON directly
                { headers: { "Content-Type": "application/json" } } // Ensure proper headers
            );

            if (response.status === 200 && response.data.body) {
                const data= JSON.parse(response.data.body);
                setInfo(data.trades || []);
                console.log("Fetched data:", data.trades);
            }
        } catch (error) {
            console.error("Error fetching data:", error);

        }
        finally {
            setLoading(false); // Set loading to false after data fetch
        }
    };

    // Fetch data only once when component mounts
    useEffect(() => {
        getDataFromApi();
    }, []);

    return (
        <div className="card-container">
           {loading ? (
                <p>Loading trades...</p>
            ) : getInfo.length > 0 ? (
                getInfo.map((item, index) => <Card key={index} {...item} />)
            ) : (
                <p>No trades found.</p>
            )}
        </div>
    );
}

export default Body;
