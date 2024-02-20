// YourReactComponent.js
import React, { useState } from 'react';
import axios from 'axios'
const YourReactComponent = () => {
  const [data, setData] = useState(null);

  const fetchDataFromFlask = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_data_for_python');
      const jsonData = await response.json();
      setData(jsonData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div >
      <h1>Your React App</h1>
      <a href="#" onClick={fetchDataFromFlask}>
        Click to Fetch Data
      </a>

      {data && (
        <div>
          <h2>Fetched Data:</h2>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default YourReactComponent;
