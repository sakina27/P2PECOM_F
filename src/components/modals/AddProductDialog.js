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

function AddProductDialog({ open, onClose, onAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!name || !price) {
      setError("Name and price are required.");
      return;
    }
    try {
      await client.post("/seller/products", {
        name,
        description,
        price: parseFloat(price),
      });
      if (onAdded) onAdded();
      setName("");
      setDescription("");
      setPrice("");
      onClose();
    } catch (e) {
      setError("Could not add product.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add a new product</DialogTitle>
      <DialogContent>
        <TextField
          label="Product name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Price (₹)"
          fullWidth
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {error && (
          <p style={{ color: "red", marginTop: 8 }}>{error}</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddProductDialog;
