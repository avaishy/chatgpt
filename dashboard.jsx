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
    <div className="dashboard-container">
 <Box sx={{    background: " #aaa",
    marginTop: "50px",
    borderRadius: "10px",
    padding: "24px",
    minHeight: "450px",
    minWidth: "750px", }}>
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
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "rgb(255, 255, 255)",
            "&:hover": { backgroundColor: "rgb(214, 214, 214)" },
            borderRadius: "20px",
            color: "black",
          }}
        >
          Add Model
        </Button>

         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          placeholder="Search"
          size="small"
          sx={{
            width: "200px",
            height: "50px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
          InputProps={{
            sx: { borderRadius: "20px" },
          }}
        />
      </Box>
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
      </Box>
    </Box>
    </div>
   
  );
};

export default Dashboard;
