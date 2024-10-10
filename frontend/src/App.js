import './App.css';
import React, { useEffect, useState } from 'react';
import Stat from './Chart/Stat';
import Barchar from './Chart/Barchar';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // For filtered transactions
  const [month, setMonth] = useState('March');
  const [searchTerm, setSearchTerm] = useState(''); // For storing the search input
  const selectMonth = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
    console.log("Selected Month:", event.target.value);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    // If search term is cleared, show all transactions for the selected month
    if (searchTerm === '') {
      setFilteredData(data);
    } else {
      // Filter the data based on title, description, or price
      const filtered = data.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.price.toString().includes(searchTerm)
      );
      setFilteredData(filtered);
    }
  };

  const API = `http://localhost:3000/api/transactions/?month=${month}`;

  useEffect(() => {
    fetchUser(API);
  }, [month]);

  const fetchUser = async (url) => {
    try {
      const res = await fetch(url);
      const result = await res.json();

      if (result && Array.isArray(result.results)) {
        setData(result.results);
        setFilteredData(result.results); // Initially, filteredData is the same as data
      } else {
        console.error("Expected an object with a 'results' array but got: ", result);
        setData([]);
        setFilteredData([]); // Clear the filtered data
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container">
      <div className="dropdown" style={{marginTop:10,marginLeft:20,display:'flex'}}>
        <label>Select Month: </label>
        <select value={month} onChange={handleMonthChange}>
          {selectMonth.map((month, index) => ( 
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
       

      {/* Search input */}
      <div className="search-box" style={{marginLeft:500}}>
        <label>Search: </label>
        <input
          type="text"
          placeholder="Search by title, description, or price"
          value={searchTerm} style={{marginLeft:6,width:500}}
          onChange={handleSearchChange}
        />
      </div>
      </div>
      {/* Table of transactions */}
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((user, index) => (
                <tr key={index}>
                  <td>{user.id}</td>
                  <td>{user.title}</td>
                  <td>{user.description}</td>
                  <td>{user.price}</td>
                  <td>{user.category}</td>
                  <td>{user.sold ? 'Yes' : 'No'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Stat month={month}/>
      <Barchar month={month}/>
    </div>
  );
}

export default App;
