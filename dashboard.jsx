import React from "react";
import "../styles/Dashboard.scss";

const Dashboard = () => {
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
      {/* Header bar with Add Model and Search */}
      <div className="header-bar">
        <button className="add-model-btn">+ Add Model</button>
        <div className="search-box">
          <input type="text" placeholder="Search" />
        </div>
      </div>

      {/* Table */}
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

.dashboard {
  background-color: #f5f5f5; /* light gray background */
  padding: 20px;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

/* Header bar */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.add-model-btn {
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.add-model-btn:hover {
  background-color: #f0f0f0;
}

.search-box input {
  border: 1px solid #dcdcdc;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 14px;
  outline: none;
  width: 150px;
}

/* Table styles */
.table-container {
  background-color: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  background-color: #fff;
  font-weight: bold;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  background-color: #fff;
  margin: 6px 0;
  border-radius: 12px;
  padding: 12px 16px;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.edit-btn {
  color: #007bff;
}

.delete-btn {
  color: #dc3545;
}
