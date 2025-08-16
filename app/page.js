'use client'
import { Paper, Divider,Grid,Box, TextField,  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,Typography, Button, MenuItem } from "@mui/material";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/searchbar";
import CardGrid from "@/components/FeaturedRecipe";
import { useRouter } from "next/navigation";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import AddRecipeDialog from "@/components/AddRecipeDialog";
 import {addRecipe, fetchRecipes, fetchRecipeById, deleteRecipe, updateRecipe, clearSelectedRecipe } from '../store/recipeslice';
import EditRecipeDialog from "@/components/EditRecipeDialog";
import DeleteDialog from "@/components/DeleteRecipeDialog";
import { useTheme } from "@mui/material/styles";
export default function FeaturedRecipe() {
 
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [skip, setSkip] = useState(0);

  const limit = 10;
  const router = useRouter();
  const [tags, setTags] = useState([]);
const [sortOrder, setSortOrder] = useState("");
const [selectedTag, setSelectedTag] = useState("");
const [meals, setMeals] = useState([]);
const [selectedMeal, setSelectedMeal] = useState("");
const [sortField, setSortField] = useState("");
const [openDialog, setOpenDialog] = useState(false);
const [editingRecipe, setEditingRecipe] = useState(null);
const [openAddDialog, setOpenAddDialog] = useState(false);

const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
const [recipeToDelete, setRecipeToDelete] = useState(null);

const [localRecipes, setLocalRecipes] = useState([]);
const [loadingRecipe, setLoadingRecipe] = useState(false);
const dispatch = useDispatch();
const { list: recipes, selectedRecipe, loading} = useSelector(state => state.recipes);


  // Fetch recipes (pagination)
 useEffect(() => {
    dispatch(fetchRecipes({ skip: 0, limit: 10 })); 
  }, [dispatch]);


// View recipe
 
const handleDeleteClick = (recipe) => {
  setRecipeToDelete(recipe);
  setOpenDeleteDialog(true);
};

// Back to list
const handleBackToList = () => {
  dispatch(clearSelectedRecipe());
};


  // Fetch tags
useEffect(() => {
  const fetchTags = async () => {
    try {
      const res = await fetch("https://dummyjson.com/recipes/tags");
      const data = await res.json();
      setTags(data || []); // array of tags
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };
  fetchTags();
}, []);

// Fetch meals
useEffect(() => {
  const fetchMeals = async () => {
    try {
      const res = await fetch("https://dummyjson.com/recipes"); // ✅ correct endpoint
      const data = await res.json();

      // data.recipes is already an array
      setMeals(data.recipes);
    } catch (err) {
      console.error("Error fetching meals:", err);
    }
  };
  fetchMeals();
}, []);




  // Handle search input from SearchBar
  const handleSearch = async (query) => {
    setSearch(query);

    if (!query.trim()) {
      fetchRecipes(); 
      return;
    }

    try {
      const res = await fetch(`https://dummyjson.com/recipes/search?q=${query}`);
      const data = await res.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };



const handleViewRecipe = (id) => {
  dispatch(fetchRecipeById(id));
  router.push(`/`); // Navigate to detail page
};
let filteredRecipes = recipes.filter((recipe) => {
  const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase());
  const matchesTag = selectedTag
    ? recipe.tags?.map(t => t.toLowerCase()).includes(selectedTag.toLowerCase())
    : true;
  const matchesMeal = selectedMeal
    ? recipe.mealType?.map(m => m.toLowerCase()).includes(selectedMeal.toLowerCase())
    : true;
  return matchesSearch && matchesTag && matchesMeal;
});

// Sort by title if selected
if (sortOrder === "asc") {
  filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
} else if (sortOrder === "desc") {
  filteredRecipes.sort((a, b) => b.name.localeCompare(a.name));
}
// const handleSortChange = (field) => {
//   setSortField(field);
//   dispatch(fetchRecipes({ skip: 0, limit: 10, sort: field }));
// };



const handleDeleteConfirm = () => {
  if (!recipeToDelete?.id) return;

  // Save deleted ID to localStorage
  const deletedIds = JSON.parse(localStorage.getItem("deletedRecipes") || "[]");
  localStorage.setItem(
    "deletedRecipes",
    JSON.stringify([...deletedIds, recipeToDelete.id])
  );

  // Remove from Redux / state
  dispatch(deleteRecipe(recipeToDelete.id));

  setOpenDeleteDialog(false);
  setRecipeToDelete(null);
};
const totalPages = Math.ceil(filteredRecipes.length / limit);
const currentPage = Math.floor(skip / limit) + 1;

const handlePrevious = () => {
  setSkip((prev) => Math.max(prev - limit, 0));
};

const handleNext = () => {
  setSkip((prev) => {
    const nextSkip = prev + limit;
    return nextSkip >= filteredRecipes.length ? prev : nextSkip;
  });
};

const paginatedRecipes = filteredRecipes.slice(skip, skip + limit);

  return (

<Box display={'flex'} sx={{ backgroundColor: theme.palette.background.default, height: "100vh", overflow: "hidden" }}>
  <Box sx={{ width: 250, flexShrink: 0, bgcolor: theme.palette.background.paper, borderRight: `1px solid ${theme.palette.divider}` }}>        <Sidebar />
      </Box>

      <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto" }}>
       

<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent:"space-between", mt: 2 }}>
  {/* Search Bar */}
  <SearchBar
    searchTerm={search}
    onSearch={handleSearch}
    filters={["Breakfast", "Lunch", "Dinner", "Dessert"]}
  />
<Box display={'flex'} gap={2} alignItems={'center'} position={'relative'}>
  {/* Tag Filter */}
  <TextField
  
    select
    label="Tag"
    value={selectedTag}
    onChange={(e) => setSelectedTag(e.target.value)}
    sx={{
      bottom:10,
      width: 180,
      bgcolor: "#fff",
      borderRadius: 2,
      boxShadow: 1,
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ddd" },
      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d26c19" },
      "& .MuiInputLabel-root": { color: "#555", fontWeight: 500 },
    }}
  >
    <MenuItem value="">All</MenuItem>
    {tags.map((tag) => (
      <MenuItem key={tag} value={tag} sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}>
        {tag}
      </MenuItem>
    ))}
  </TextField>

  {/* Meal Filter */}
  <TextField
    select
    label="Meal"
    value={selectedMeal}
    onChange={(e) => setSelectedMeal(e.target.value)}
    sx={{
      bottom:10,
      width: 180,
      bgcolor: "#fff",
      borderRadius: 2,
      boxShadow: 1,
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ddd" },
      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d26c19" },
      "& .MuiInputLabel-root": { color: "#555", fontWeight: 500 },
    }}
  >
{meals
  .filter((meal) =>
    ![
      "breakfast",
      "lunch",
      "dinner",
      "dessert",
      "snack",
      "drink",
      "appetizer",
      "side",
    ].includes(meal.name.toLowerCase())
  )
  .map((meal) => (
    <div key={meal.id}>{meal.name}</div>
  ))}



  </TextField>
<TextField
  select
  label="Sort by Title"
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
  sx={{
    bottom: 10,
    width: 180,
    bgcolor: "#fff",
    borderRadius: 2,
    boxShadow: 1,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ddd" },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d26c19" },
    "& .MuiInputLabel-root": { color: "#555", fontWeight: 500 },
  }}
>
  <MenuItem value="">None</MenuItem>
  <MenuItem value="asc">A → Z</MenuItem>
  <MenuItem value="desc">Z → A</MenuItem>
</TextField>


  </Box>
</Box>



<Box display={'flex'} justifyContent={'space-between'}  alignItems="center">    
    <Typography variant="h4" gutterBottom mt={3} fontFamily={'monserrat'} fontWeight={'bold'} mb={3}>
          Ultimate Recipe Management System
        </Typography>

{!selectedRecipe && (
  <Button
    sx={{
      borderRadius: 5,
      fontWeight: "bold",
      fontSize: 15,
      mb: 2,
      backgroundColor: "#d26c19",
      p: 2,
      color: "white",
    }}
    onClick={() => setOpenAddDialog(true)}
  >
    Add Recipe
  </Button>
)}
<AddRecipeDialog
  open={openAddDialog}
  onClose={() => setOpenAddDialog(false)}
  onSubmit={(newRecipe) => {
    dispatch(addRecipe(newRecipe)); 
    setOpenAddDialog(false);        
  }}
/>

    </Box>

     
{selectedRecipe ? (
  <Box>
     <Box display={'flex'} justifyContent={'space-between'}>
    <Button  onClick={handleBackToList} sx={{borderRadius:5,fontWeight:'bold', fontSize:15,mb: 2 ,backgroundColor: "#d26c19",p:1.5, color: "white", "&:hover": { backgroundColor: "#b55b16" } }}>
      Back to Recipes
    </Button>
    <Box sx={{ display: 'flex', gap: 2 ,mb:2}}>
<Button
  variant="contained"
  sx={{
    borderRadius: 10,
    backgroundColor: "#d26c19",
    "&:hover": { backgroundColor: "#45a049" },
    minWidth: 50,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 0
  }}
  onClick={() => {
    setEditingRecipe(selectedRecipe); 
    setOpenAddDialog(true);          
  }}
>
  <EditIcon />
</Button>
<EditRecipeDialog
  open={openAddDialog}
  onClose={() => setOpenAddDialog(false)}
  recipe={editingRecipe} 
  />



<Button
  variant="contained"
  sx={{
    borderRadius: 10,
    backgroundColor: "#d32f2f",
    "&:hover": { backgroundColor: "#b55b16" },
    minWidth: 50,
    height: 50
  }}
  onClick={() => handleDeleteClick(selectedRecipe)} 
>
  <DeleteIcon />
</Button>
{/* 
<DeleteDialog
  open={openDeleteDialog}
  onClose={() => setOpenDeleteDialog(false)}
  itemName={selectedRecipe.name}
  onConfirm={handleDeleteConfirm}
/> */}
<DeleteDialog
  open={openDeleteDialog}
  onClose={() => setOpenDeleteDialog(false)}
  itemName={recipeToDelete?.name} // ✅ use recipeToDelete
  onConfirm={handleDeleteConfirm}
/>


</Box>
    </Box>
    {loadingRecipe ? (
      <CircularProgress />
    ) : (


<Paper
  elevation={4}
  sx={{
    p: 4,
    borderRadius: 3,
    backgroundColor: theme.palette.background.paper, // theme-aware
    color: theme.palette.text.primary, // text color adapts
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
    maxWidth: 1200,
    margin: 'auto',
  }}
>
  {/* Image Section */}
  <Box sx={{ flex: 1, minWidth: 300 }}>
    <img
      src={selectedRecipe.image}
      alt={selectedRecipe.name}
      style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 500 }}
    />
  </Box>

  {/* Content Section */}
  <Box sx={{ flex: 1, minWidth: 300, lineHeight: 1.7, fontFamily: 'monserrat', color: theme.palette.text.primary }}>
    <Typography
      variant="h4"
      fontWeight="bold"
      gutterBottom
      sx={{ letterSpacing: '1px', mb: 2, color: theme.palette.primary.main }} // use primary from theme
    >
      {selectedRecipe.name}
    </Typography>

    {/* Ingredients */}
    <Typography
      variant="h6"
      fontWeight="600"
      sx={{ mb: 1, color: theme.palette.text.secondary, letterSpacing: '0.5px' }} // secondary text
    >
      Ingredients:
    </Typography>
    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
      {selectedRecipe.ingredients?.map((ing, i) => (
        <li key={i} style={{ marginBottom: '6px', fontSize: '1rem', color: theme.palette.text.primary }}>
          {ing}
        </li>
      ))}
    </Box>

    <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

    {/* Instructions */}
    <Typography
      variant="h6"
      fontWeight="600"
      sx={{ mb: 1, color: theme.palette.text.secondary, letterSpacing: '0.5px' }}
    >
      Instructions:
    </Typography>
    <Typography sx={{ fontSize: '1rem', color: theme.palette.text.primary, lineHeight: 1.8 }}>
      {selectedRecipe.instructions}
    </Typography>
  </Box>
</Paper>

    )}
  </Box>
) : (
  <>
   <CardGrid
   items={paginatedRecipes}
  imageKey="image"
  titleKey="name"
  subtitleKey="cuisine"
  extraInfo={(item) => `Servings: ${item.servings} | Cook Time: ${item.cookTimeMinutes} min`}
  buttonText="View Recipe"
  onButtonClick={(item) => handleViewRecipe(item.id)}
/>

    {/* Pagination Buttons */}
  <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
  <Button
    sx={{ backgroundColor: "#d26c19ff", color: "white", p: 1.5, borderRadius: 2 }}
    onClick={handlePrevious}
    disabled={currentPage === 1}
  >
    Previous
  </Button>
  <Typography sx={{ mt: 1.5, fontWeight: 'bold' }}>
    Page {currentPage} of {totalPages}
  </Typography>
  <Button
    sx={{ backgroundColor: "#d26c19ff", color: "white", p: 1.5, borderRadius: 2 }}
    onClick={handleNext}
    disabled={currentPage === totalPages}
  >
    Next
  </Button>
</Box>

  </>
)}

      </Box>
    
    </Box>
  );
}
