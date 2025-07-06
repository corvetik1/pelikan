"use client";

import React from "react";
import { Card, CardActionArea, CardContent, Typography, CardMedia } from "@mui/material";
import Link from "next/link";
import type { AdminRecipe } from "@/types/admin";

interface Props {
  item: AdminRecipe;
}

export default function RecipeCardHome({ item }: Props) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea component={Link} href={`/recipes/${item.id}`} sx={{ height: "100%" }}>
        {item.img && <CardMedia component="img" height={160} image={item.img} alt={item.title} />}
        <CardContent>
          <Typography variant="subtitle1" component="h3" gutterBottom>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.category} · {item.cookingTime} мин
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
