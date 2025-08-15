"use client";

import React from "react";
import { Box, Skeleton, Grid, Button } from "@mui/material";
import RecipeCardHome from "@/components/home/RecipeCardHome";
import { useGetRecipesPublicQuery, useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/api";
import { siteOrigin } from "@/lib/site";
import EditableField from "@/components/admin/EditableField";

export default function RecipesSection(): React.JSX.Element {
  const { data = [], isLoading } = useGetRecipesPublicQuery();
  const { data: settings } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const items = data.slice(0, 3);
  const origin = siteOrigin();
  function toAbs(u?: string): string | undefined {
    if (!u) return undefined;
    return u.startsWith('http') ? u : `${origin}${u.startsWith('/') ? '' : '/'}${u}`;
  }
  const jsonLd = !isLoading && items.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: items.map((r, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Recipe',
            name: r.title,
            image: toAbs(r.img),
            url: `${origin}/recipes/${r.slug}`,
            totalTime: `PT${Math.max(1, Number(r.cookingTime || 0))}M`,
            recipeCategory: r.category,
          },
        })),
      }
    : null;
  const title: string = (settings?.homeRecipesTitle ?? '').trim().length > 0 ? String(settings?.homeRecipesTitle) : 'Рецепты';

  return (
    <Box sx={{ mt: 8 }}>
      <EditableField
        value={title}
        typographyProps={{ variant: "h5", component: "h2", gutterBottom: true }}
        onSave={async (v: string): Promise<void> => {
          await updateSettings({ homeRecipesTitle: v });
        }}
      />
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rectangular" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <RecipeCardHome item={item} />
            </Grid>
          ))}
        </Grid>
      )}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button href="/recipes" variant="text">Все рецепты</Button>
      </Box>
    </Box>
  );
}
