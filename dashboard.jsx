import React from "react";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    <Box sx={{ background: "#fff", padding: "24px", minHeight: "100vh" }}>
      {/* Top Bar with Add Button & Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#006FCF",
            "&:hover": { backgroundColor: "#005bb5" },
          }}
        >
          Add Model
        </Button>

        <TextField
          size="small"
          placeholder="Search"
          variant="outlined"
          sx={{ width: "250px" }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Model</b></TableCell>
              <TableCell><b>EMM ID</b></TableCell>
              <TableCell><b>Version ID</b></TableCell>
              <TableCell><b>Version</b></TableCell>
              <TableCell><b>Market</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modelData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.model}</TableCell>
                <TableCell>{row.emmId}</TableCell>
                <TableCell>{row.versionId}</TableCell>
                <TableCell>{row.version}</TableCell>
                <TableCell>{row.market}</TableCell>
                <TableCell>
                  <IconButton color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bottom Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <Button variant="contained" sx={{ backgroundColor: "#E4D9FA", color: "#4B2991" }}>
          Recent Executions
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#FAD9EC", color: "#9F2979" }}>
          Reports
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#D1E6FF", color: "#006FCF" }}>
          Quick Links
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;