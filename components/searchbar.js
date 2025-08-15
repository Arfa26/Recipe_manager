"use client";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ searchTerm, onSearch, placeholder = "Search...", filters = [] }) {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <Box style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
      <TextField
        label={placeholder}
        value={searchTerm}
        onChange={handleChange}
        sx={{
          flex: 1,
          maxWidth: "400px",
          backgroundColor: "white",
          borderRadius: "30px",
          "& .MuiOutlinedInput-root": {
            height: "50px",
            borderRadius: "30px",
            "& fieldset": {
              borderWidth: "2px",
              borderColor: "rgba(245, 241, 0, 1)",
            },
            "&:hover fieldset": { borderColor: "#d26c19ff" },
            "&.Mui-focused fieldset": { borderColor: "#d26c19ff" },
          },
          "& .MuiOutlinedInput-input": { padding: "12px 14px" },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "gray" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
