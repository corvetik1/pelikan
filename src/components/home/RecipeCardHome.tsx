"use client";

import React from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import type { AdminRecipe } from "@/types/admin";

interface Props {
  item: AdminRecipe;
}

export default function RecipeCardHome({ item }: Props): React.JSX.Element {
  return (
    <Card sx={{ height: "100%" }} component="article" itemScope itemType="https://schema.org/Recipe">
      <CardActionArea component={Link} href={`/recipes/${item.slug}`} sx={{ height: "100%" }}>
        {item.img && (
          <Image
            src={item.img}
            alt={item.title}
            width={800}
            height={450}
            style={{ width: '100%', height: 'auto' }}
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            itemProp="image"
          />
        )}
        <CardContent>
          <Typography variant="subtitle1" component="h3" gutterBottom itemProp="name">
            {item.title}
          </Typography>
          <meta itemProp="totalTime" content={`PT${Math.max(1, Number(item.cookingTime || 0))}M`} />
          <Typography variant="body2" color="text.secondary">
            {item.category} · {item.cookingTime} мин
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
