import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      setBatteryLevel(data.batteryLevel);
      setStatus(data.status);
      setLogs(data.logs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  return (
    <div className="dashboard">
      <h1>Robotic System Dashboard</h1>
      <div className="status">
        <h2>Status:</h2>
        <p>{status}</p>
      </div>
      <div className="battery">
        <h2>Battery Level:</h2>
        <p>{batteryLevel}%</p>
      </div>
      <div className="logs">
        <h2>Recent Activity Logs:</h2>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
      <div className="interactions">
        <button onClick={refreshData}>Refresh Data</button>
      </div>
    </div>
  );
};

export default Dashboard;
