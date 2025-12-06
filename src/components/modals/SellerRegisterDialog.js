import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import client from "../../api/client";

function SellerRegisterDialog({ open, onClose, onSuccess }) {
  const [shopName, setShopName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      await client.post("/seller/register", {
        shopName,
        gstNumber,
        address,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError("Could not register as seller.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Become a Seller</DialogTitle>
      <DialogContent>
        <TextField
          label="Shop Name"
          fullWidth
          margin="normal"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />
        <TextField
          label="GST Number"
          fullWidth
          margin="normal"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
        />
        <TextField
          label="Business Address"
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {error && (
          <p style={{ color: "red", marginTop: 8 }}>{error}</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SellerRegisterDialog;
