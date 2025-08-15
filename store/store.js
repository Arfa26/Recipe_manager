// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./recipeslice";

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
  },
  
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     thunk:true,
  //     serializableCheck: false, 
  //   }),
});
