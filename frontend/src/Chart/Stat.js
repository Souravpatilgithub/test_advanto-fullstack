import React, { useEffect, useState } from 'react';
import './Stat.css'
function Stat({ month }) {
  const [stat, setStat] = useState([]);
  const API = `http://localhost:7000/api/statistics?month=${month}`;

  useEffect(() => {
    fetchStat(API);
  }, [month]); 

  const fetchStat = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      
      console.log("API Response:", data);

      if (Array.isArray(data)) {
        setStat(data);
      } else if (data && typeof data === 'object') {
      
        setStat([data]); 
      } else {
        console.error("Unexpected data format:", data);
        setStat([]); 
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setStat([]); 
    }
  };

  return (
    <div>
      {stat.length > 0 ? (
        stat.map((data, index) => (
          <div key={index}>
            <h1>Month: {data.month}</h1>
            <h2>Total Sale Amount: {data.total_sale_amount}</h2>
            <h2>Total Sold Items: {data.total_sold_items}</h2>
            <h2>Total Not Sold Items: {data.total_not_sold_items}</h2>
          </div>
        ))
      ) : (
        <h1>No statistics available for this month.</h1>
      )}
    </div>
  );
}

export default Stat;
