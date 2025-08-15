import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load from localStorage
const initialRecipes = typeof window !== "undefined" && localStorage.getItem("recipes")
  ? JSON.parse(localStorage.getItem("recipes"))
  : [];

const initialBookmarks = typeof window !== "undefined" && localStorage.getItem("bookmarks")
  ? JSON.parse(localStorage.getItem("bookmarks"))
  : [];

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ skip = 0, limit = 10 } = {}) => {
    let recipesList;

    if (initialRecipes.length) {
      recipesList = initialRecipes;
    } else {
      const res = await fetch(`https://dummyjson.com/recipes?limit=${limit}&skip=${skip}${sort ? `&sort=${sort}` : ''}`);
      const data = await res.json();
      recipesList = data.recipes;
    }

    // Filter out deleted recipes stored in localStorage
    const deletedIds = JSON.parse(localStorage.getItem("deletedRecipes") || "[]");
    const filteredRecipes = recipesList.filter(recipe => !deletedIds.includes(recipe.id));

    return filteredRecipes;
  }
);

export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (newRecipe) => {
    const id = Date.now();
    return { id, ...newRecipe };
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id) => {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    return recipes.find(r => r.id === id);
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (id, { rejectWithValue }) => {
    try {
      console.log("Redux: Deleting recipe with ID:", id);

      const response = await fetch(`https://dummyjson.com/recipes/${id}`, {
        method: "DELETE",
      });

      console.log("Redux: Delete response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Redux: Delete recipe failed:",
          response.status,
          errorData
        );
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Redux: Recipe deleted successfully:", data);

      // dummyjson returns { ...recipeData, isDeleted: true, deletedOn: "..." }
      return data.id; // Return deleted recipe ID so we can remove it from state
    } catch (error) {
      console.error("Redux: Delete recipe error:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, updatedData }) => ({ id, updatedData })
);

// Slice
const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    list: initialRecipes,
    selectedRecipe: null,
    bookmarks: initialBookmarks,
    searchCache: {}, // { query: results }
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedRecipe: (state) => { state.selectedRecipe = null; },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => { state.loading = true; })
      .addCase(fetchRecipes.fulfilled, (state, action) => { state.list = action.payload; state.loading = false; })
      .addCase(fetchRecipes.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(addRecipe.fulfilled, (state, action) => {
        state.list.push(action.payload);
        localStorage.setItem("recipes", JSON.stringify(state.list));
      })

      .addCase(fetchRecipeById.fulfilled, (state, action) => { state.selectedRecipe = action.payload; })

      // Delete
      .addCase(deleteRecipe.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((r) => r.id !== action.payload);
        if (state.selectedRecipe?.id === action.payload) {
          state.selectedRecipe = null;
        }
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete recipe";
      })

      .addCase(updateRecipe.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        state.list = state.list.map(r => r.id === id ? { ...r, ...updatedData } : r);
        state.selectedRecipe = state.list.find(r => r.id === id);
        localStorage.setItem("recipes", JSON.stringify(state.list));
      });
  }
});

export const { clearSelectedRecipe, bookmarkRecipe, removeBookmark, cacheSearchResults } = recipeSlice.actions;
export default recipeSlice.reducer;
