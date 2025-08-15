'use client';
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default function DeleteDialog({ open, onClose, itemName, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{itemName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} sx={{ backgroundColor: "#d32f2f", color: "white" }} variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
