"use client";

import {
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
  Button,
  ImageList,
  ImageListItem,
} from "@mui/material";
import Image from "next/image";
import type { Product } from "@/data/mock";

interface ProductDetailProps {
  product: Product;
}

/**
 * Детальная страница товара: галерея изображений, описание и характеристики.
 * Требования:
 * - Адаптивная верстка на базе MUI (Grid v7 -> flex Box).
 * - Без кнопки «В корзину»; вместо неё — «Запросить предложение».
 * - Строгая типизация без any / ts-ignore.
 */
export default function ProductDetail({ product }: ProductDetailProps) {
  const {
    name,
    images,
    img,
    description,
    price,
    weight,
    processing,
    packageWeight,
    packageType,
    origin,
    certificates,
    isNew,
    isPromo,
  } = product;

  const gallery = images && images.length > 0 ? images : [img];

  return (
    <Box sx={{ py: 4 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* Gallery */}
        <Box flexShrink={0} sx={{ width: { xs: "100%", md: 400 } }}>
          <ImageList cols={1} gap={8}>
            {gallery.map((src) => (
              <ImageListItem key={src} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Image
                  src={src}
                  alt={name}
                  width={400}
                  height={400}
                  style={{ objectFit: "cover" }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>

        {/* Info */}
        <Stack spacing={2} flex={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            {isNew && <Chip label="NEW" color="primary" size="small" />}
            {isPromo && <Chip label="PROMO" color="secondary" size="small" />}
            <Typography component="h1" variant="h5">
              {name}
            </Typography>
          </Stack>

          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>

          <Divider />

          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Цена
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {price.toLocaleString("ru-RU", {
                style: "currency",
                currency: "RUB",
                maximumFractionDigits: 0,
              })}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Характеристики
            </Typography>
            <Typography variant="body2">Вес: {weight}</Typography>
            {processing && <Typography variant="body2">Обработка: {processing}</Typography>}
            {packageWeight && <Typography variant="body2">Вес упаковки: {packageWeight} г</Typography>}
            {packageType && <Typography variant="body2">Тип упаковки: {packageType}</Typography>}
            {origin && <Typography variant="body2">Происхождение: {origin}</Typography>}
            {certificates && certificates.length > 0 && (
              <Typography variant="body2">Сертификаты: {certificates.join(", ")}</Typography>
            )}
          </Stack>

          <Divider />

          <Button variant="contained" size="large" sx={{ alignSelf: "flex-start" }}>
            Запросить предложение
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
