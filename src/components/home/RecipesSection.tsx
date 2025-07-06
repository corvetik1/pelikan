"use client";

import React from "react";
import { Box, Typography, Skeleton, Grid } from "@mui/material";
import RecipeCardHome from "@/components/home/RecipeCardHome";
import { useGetAdminRecipesQuery } from "@/redux/adminApi";

export default function RecipesSection() {
  const { data = [], isLoading } = useGetAdminRecipesQuery();
  const items = data.slice(0, 6);

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Рецепты
      </Typography>
      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} variant="rectangular" height={220} />
          ))}
        </Box>
      ) : (
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <RecipeCardHome item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
