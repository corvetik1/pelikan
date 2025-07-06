"use client";

import React from "react";
import { Box, Typography, Grid, Skeleton } from "@mui/material";
import NewsCard from "./NewsCard";
import { useGetAdminNewsQuery } from "@/redux/api";

export default function NewsSection() {
  const { data = [], isLoading } = useGetAdminNewsQuery();
  const items = data.slice(0, 4);

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Новости
      </Typography>
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Skeleton variant="rectangular" height={180} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
              <NewsCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
