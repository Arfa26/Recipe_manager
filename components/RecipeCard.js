import { Card, CardMedia, CardContent, Typography, Box, Button, Rating } from "@mui/material";

export default function RecipeCard({ recipe }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="160"
        image={recipe.image}
        alt={recipe.title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">{recipe.title}</Typography>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Rating value={recipe.rating} precision={0.5} readOnly size="small" />
          <Typography variant="body2">({recipe.reviews} Reviews)</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">{recipe.time}</Typography>
        <Box mt={1}>
          <Button variant="contained" color="success" size="small">View Recipe</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
