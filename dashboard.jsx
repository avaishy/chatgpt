import React from "react";
import "./Dashboard.scss";

const modelData = [
  {
    model: "Ask Amex Bot",
    emmId: 4925,
    versionId: 19181,
    version: "1.1",
    market: "United States",
  },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
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
}

.table-container {
  background-color: #fff; /* white table background */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  background-color: #ffffff; /* white header */
  font-weight: bold;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  background-color: #ffffff; /* white row */
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0; /* light gray line between rows */
}

.table-row:last-child {
  border-bottom: none; /* no line after last row */
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
  color: #007bff; /* blue color for edit */
}

.delete-btn {
  color: #dc3545; /* red color for delete */
}