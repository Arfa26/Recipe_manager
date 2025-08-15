'use client'
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const RecipeSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  cuisine: Yup.string().required("Cuisine is required"),
  servings: Yup.number().required("Servings required").min(1, "Must be at least 1"),
  cookTimeMinutes: Yup.number().required("Cook time required").min(1, "Must be at least 1"),
  image: Yup.string().url("Invalid URL").required("Image URL required"),
  ingredients: Yup.string().required("Ingredients required"),
  instructions: Yup.string().required("Instructions required"),
});

export default function AddRecipeDialog({ open, onClose, onSubmit }) {
  const initialValues = {
    name: "",
    cuisine: "",
    servings: "",
    cookTimeMinutes: "",
    image: "",
    ingredients: "",
    instructions: "",
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{fontWeight:'bold'}}>Add New Recipe</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={RecipeSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit({
            ...values,
            servings: Number(values.servings),
            cookTimeMinutes: Number(values.cookTimeMinutes),
            ingredients: values.ingredients.split(",").map(i => i.trim())
          });
          setSubmitting(false);
          resetForm();
          onClose();
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <DialogContent sx={{ mt: 1 }}>
              
              {/* Name & Cuisine */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    // width="100%"
                    fullWidth
                    size="small"
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Cuisine"
                    name="cuisine"
                    value={values.cuisine}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.cuisine && Boolean(errors.cuisine)}
                    helperText={touched.cuisine && errors.cuisine}
                    fullWidth
                    size="small"
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              </Grid>

              {/* Servings & Cook Time */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    label="Servings"
                    name="servings"
                    type="number"
                    value={values.servings}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.servings && Boolean(errors.servings)}
                    helperText={touched.servings && errors.servings}
                    fullWidth
                    size="small"
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Cook Time (minutes)"
                    name="cookTimeMinutes"
                    type="number"
                    value={values.cookTimeMinutes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.cookTimeMinutes && Boolean(errors.cookTimeMinutes)}
                    helperText={touched.cookTimeMinutes && errors.cookTimeMinutes}
                    fullWidth
                    size="small"
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              </Grid>

              {/* Image URL */}
              <TextField
                label="Image URL"
                name="image"
                value={values.image}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.image && Boolean(errors.image)}
                helperText={touched.image && errors.image}
                fullWidth
                size="small"
                sx={{ mt: 1, borderRadius: 3 }}
              />

              {/* Ingredients */}
              <TextField
                label="Ingredients (comma separated)"
                name="ingredients"
                value={values.ingredients}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ingredients && Boolean(errors.ingredients)}
                helperText={touched.ingredients && errors.ingredients}
                multiline
                rows={3}
                fullWidth
                size="small"
                sx={{ mt: 1, borderRadius: 3 }}
              />

              {/* Instructions */}
              <TextField
                label="Instructions"
                name="instructions"
                value={values.instructions}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.instructions && Boolean(errors.instructions)}
                helperText={touched.instructions && errors.instructions}
                multiline
                rows={4}
                fullWidth
                size="small"
                sx={{ mt: 1, borderRadius: 3 }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} sx={{ color: "#555" }}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "#d26c19", "&:hover": { backgroundColor: "#b55b16" } }}
                disabled={isSubmitting}
              >
                Add
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
