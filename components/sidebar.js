import { Box, Avatar, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import { useRouter } from "next/navigation";
export default function Sidebar() {
  const theme = useTheme(); // access current theme (dark/light)
const router = useRouter();
  const menuItems = [
    { icon: <RestaurantMenuIcon />, label: "Recipes",path: "/" },
    { icon: <FavoriteIcon />, label: "Favorites" },
    { icon: <SchoolIcon />, label: "Courses" },
    { icon: <PeopleIcon />, label: "Community" },
  ];

  return (
    <Box
      sx={{
        height: '100vh',
        width: 250,
        p: 3,
        bgcolor: theme.palette.background.paper, // theme-aware
        borderRight: `1px solid ${theme.palette.divider}`, // theme-aware
        color: theme.palette.text.primary, // text color adapts
      }}
    >
      <Avatar
        src="/images/avatar.jpg"
        sx={{ width: 100, height: 100, mb: 1 }}
      />
      <Typography variant="h6">{/* Name */}Recipe Webb</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Master Chef
      </Typography>

      <List>
        {menuItems.map((item, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              {item.icon}
              <ListItemText primary={item.label} sx={{ ml: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
