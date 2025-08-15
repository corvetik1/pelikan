"use client";

import React from "react";
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import Link from "next/link";
import dayjs from "dayjs";
import type { AdminNews } from "@/types/admin";
import Image from "next/image";

interface NewsCardProps {
  item: AdminNews;
}

export default function NewsCard({ item }: NewsCardProps): React.JSX.Element {
  return (
    <Card sx={{ height: "100%" }} component="article" itemScope itemType="https://schema.org/NewsArticle">
      <CardActionArea component={Link} href={`/news/${item.slug}`} sx={{ height: "100%" }}>
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
          <meta itemProp="datePublished" content={dayjs(item.date).toISOString()} />
          <Typography variant="overline" color="text.secondary">
            {dayjs(item.date).format("DD.MM.YYYY")}
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom itemProp="headline">
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" itemProp="description">
            {item.excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
