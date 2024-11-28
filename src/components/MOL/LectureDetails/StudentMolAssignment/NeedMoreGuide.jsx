import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { getGuidance } from "@/api/apiHelper";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function NeedMoreGuide({ assignmentId, open, setOpen }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assignmentId && open) {
      fetchData();
    }
  }, [assignmentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getGuidance(assignmentId);
      console.log("NeedMoreGuide response : ", response);
      setData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Function to render nested data
  const renderData = (data) => {
    return Object.keys(data).map((key) => {
      const value = data[key];
      if (typeof value === "object") {
        return (
          <div key={key} style={{ marginBottom: "16px" }}>
            <h3>{formatKey(key)}</h3>
            <ul style={{ paddingLeft: "20px" }}>
              {Object.keys(value).map((subKey) => (
                <li key={subKey}>
                  <strong>{formatKey(subKey)}:</strong> {value[subKey]}
                </li>
              ))}
            </ul>
          </div>
        );
      } else {
        return (
          <div key={key} style={{ marginBottom: "8px" }}>
            <strong>{formatKey(key)}:</strong> {value}
          </div>
        );
      }
    });
  };

  // Function to format keys (optional)
  const formatKey = (key) => {
    return key.replace(/_/g, " ");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">Guidance</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography>please wait...</Typography>
            </Box>
          ) : (
            data && renderData(data)
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
