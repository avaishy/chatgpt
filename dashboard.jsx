
      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{
          margin: "16px",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5"
        }}>
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
