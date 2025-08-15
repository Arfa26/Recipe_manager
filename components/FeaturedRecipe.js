'use client'
import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";

const CardGrid = ({ items, imageKey, titleKey, subtitleKey, extraInfo, buttonText, onButtonClick }) => {
  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, width: "254px", height: "400px" }}>
            <CardMedia
              component="img"
              height="200"
              image={item[imageKey]}
              alt={item[titleKey]}
            />
            <CardContent>
              <Typography
  variant="h6"
  sx={{
    height: "4rem",          // fixed height for title
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,      // show max 2 lines
    WebkitBoxOrient: "vertical",
  }}
>{item[titleKey]}</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {item[subtitleKey]}
              </Typography>
              {extraInfo && (
                <Typography variant="caption" display="block" mt={1}>
                  {extraInfo(item)}
                </Typography>
              )}
              {buttonText && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 1, backgroundColor: "#d26c19", "&:hover": { backgroundColor: "#b55b16" } }}
                  onClick={() => onButtonClick && onButtonClick(item)}
                >
                  {buttonText}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardGrid;
