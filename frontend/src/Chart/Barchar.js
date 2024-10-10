import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Barchar = ({ month }) => {
  const [stat, setStat] = useState([]);
  const API = `http://localhost:4444/api/bar-chart?month=${month}`;

  useEffect(() => {
    fetchStat(API);
  }, [month]);

  const fetchStat = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      console.log("API Response:", data);

      if (data && data.price_ranges) {
        const transformedData = Object.keys(data.price_ranges).map((range) => ({
          range, 
          count: data.price_ranges[range], 
        }));
        setStat(transformedData);
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
    <div style={{ width: '100%', height: 400 }}>
      {stat.length > 0 ? (
        <ResponsiveContainer width="50%" height={400}>
          <BarChart data={stat}>
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <h2>No data available for this month</h2>
      )}
    </div>
  );
};

export default Barchar;
