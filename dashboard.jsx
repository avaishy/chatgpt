import React from "react";
import "../styles/Dashboard.scss"; // Import your CSS file
import { Button } from "@mui/material";


const Dashboard = () => {
  // Example data
  const modelData = [
    {
      model: "Ask Amex Bot",
      emmId: "4925",
      versionId: "19181",
      version: "1.1",
      market: "United States",
    },
  ];

  return (
    <div className="dashboard">

     <Button>Add Model</Button>
      <div className="table-container">
        <div className="table-header">
          <div>Model</div>
          <div>EMM ID</div>
          <div>Version ID</div>
          <div>Version</div>
          <div>Market</div>
          <div>Action</div>
        </div>

        {modelData.map((row, index) => (
          <div className="table-row" key={index}>
            <div>{row.model}</div>
            <div>{row.emmId}</div>
            <div>{row.versionId}</div>
            <div>{row.version}</div>
            <div>{row.market}</div>
            <div className="actions">
              <button className="edit-btn">✏️</button>
              <button className="delete-btn">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
   
  );
};

export default Dashboard;
