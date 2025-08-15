"use client";

import React from "react";
import { Box, Grid, Skeleton, Button } from "@mui/material";
import NewsCard from "./NewsCard";
import { useGetNewsPublicQuery, useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/api";
import { siteOrigin } from "@/lib/site";
import EditableField from "@/components/admin/EditableField";

export default function NewsSection(): React.JSX.Element {
  const { data = [], isLoading } = useGetNewsPublicQuery();
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
        itemListElement: items.map((n, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'NewsArticle',
            headline: n.title,
            datePublished: n.date,
            image: toAbs(n.img),
            url: `${origin}/news/${n.slug}`,
            description: n.excerpt,
          },
        })),
      }
    : null;
  const title: string = (settings?.homeNewsTitle ?? '').trim().length > 0 ? String(settings?.homeNewsTitle) : 'Новости';

  return (
    <Box sx={{ mt: 6 }}>
      <EditableField
        value={title}
        typographyProps={{ variant: "h5", component: "h2", gutterBottom: true }}
        onSave={async (v: string): Promise<void> => {
          await updateSettings({ homeNewsTitle: v });
        }}
      />
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Skeleton variant="rectangular" height={180} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <NewsCard item={item} />
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
        <Button href="/news" variant="text">Все новости</Button>
      </Box>
    </Box>
  );
}
