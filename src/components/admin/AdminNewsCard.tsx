"use client";

import { Card, CardActionArea, CardContent, Typography, Chip, Box } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { AdminNews } from "@/types/admin";

dayjs.locale("ru");

interface AdminNewsCardProps {
  item: AdminNews;
  onClick?: () => void;
}

/**
 * Карточка новости для админ-грида (просмотр/редактирование).
 * Минимальный набор: дата, заголовок, excerpt.
 */
export default function AdminNewsCard({ item, onClick }: AdminNewsCardProps) {
  const { title, excerpt, date, category } = item;
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea sx={{ height: "100%" }} onClick={onClick}>
        <CardContent>
          <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
            <Chip label={dayjs(date).format("D MMM YYYY")} size="small" />
            {category?.title && <Chip label={category.title} size="small" />}
          </Box>
          <Typography component="h3" variant="subtitle1" gutterBottom noWrap>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
