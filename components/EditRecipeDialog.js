'use client'
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateRecipe } from "@/store/recipeslice";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Alert } from "@mui/material";

export default function EditRecipeDialog({ open, onClose, recipe }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    servings: "",
    cookTimeMinutes: "",
    image: "",
    ingredients: "",
    instructions: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  // Populate form when dialog opens
  useEffect(() => {
    if (recipe) {
      setFormData({
        ...recipe,
        ingredients: recipe.ingredients?.join(", ") || "",
      });
    }
  }, [recipe, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      servings: Number(formData.servings),
      cookTimeMinutes: Number(formData.cookTimeMinutes),
      ingredients: formData.ingredients.split(",").map(i => i.trim()),
    };

    try {
      await dispatch(updateRecipe({ id: recipe.id, updatedData: payload })).unwrap();
      setStatus({ type: "success", message: "Recipe updated successfully!" });
      onClose();
    } catch (err) {
      setStatus({ type: "error", message: "Failed to update recipe." });
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Recipe</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {status.message && (
          <Alert severity={status.type} onClose={() => setStatus({ type: "", message: "" })}>
            {status.message}
          </Alert>
        )}
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
        <TextField label="Cuisine" name="cuisine" value={formData.cuisine} onChange={handleChange} fullWidth />
        <TextField label="Servings" name="servings" type="number" value={formData.servings} onChange={handleChange} fullWidth />
        <TextField label="Cook Time (minutes)" name="cookTimeMinutes" type="number" value={formData.cookTimeMinutes} onChange={handleChange} fullWidth />
        <TextField label="Image URL" name="image" value={formData.image} onChange={handleChange} fullWidth />
        <TextField label="Ingredients (comma separated)" name="ingredients" value={formData.ingredients} onChange={handleChange} multiline rows={3} fullWidth />
        <TextField label="Instructions" name="instructions" value={formData.instructions} onChange={handleChange} multiline rows={4} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#555" }}>Cancel</Button>
        <Button variant="contained" sx={{ backgroundColor: "#d26c19", "&:hover": { backgroundColor: "#b55b16" } }} onClick={handleSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
