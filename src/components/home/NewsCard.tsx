"use client";

import React from "react";
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import Link from "next/link";
import dayjs from "dayjs";
import type { AdminNews } from "@/types/admin";

interface NewsCardProps {
  item: AdminNews;
}

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea component={Link} href={`/news/${item.id}`} sx={{ height: "100%" }}>
        {/* Если появится изображение, добавить CardMedia */}
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            {dayjs(item.date).format("DD.MM.YYYY")}
          </Typography>
          <Typography variant="h6" component="div" gutterBottom>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
