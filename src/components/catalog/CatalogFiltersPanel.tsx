"use client";

import { Box, Slider, FormControlLabel, Checkbox, Typography, Stack, Divider, Button } from "@mui/material";
import MultiSelectFilter from "./MultiSelectFilter";
import ViewToggle from "./ViewToggle";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  setPrice,
  toggleOnlyNew,
  toggleOnlyPromo,
  setProcessing,
  setPackageTypes,
  setOrigins,
  setCertificates,
  resetFilters,
} from "@/redux/catalogFiltersSlice";

/**
 * Простая панель фильтров каталога (MVP).
 * Содержит диапазон цены и чекбоксы «Новинки» / «Акции».
 * Будет расширяться дополнительными фильтрами.
 */
export default function CatalogFiltersPanel() {
  // TODO: options lists – ideally fetched from API; mock static arrays for now
  const PROCESSING_OPTIONS = ["fresh", "frozen", "salted", "smoked"] as const;
  const PACKAGE_TYPES = ["vacuum", "tray", "box"] as const;
  const ORIGIN_OPTIONS = ["Россия", "Норвегия", "Чили", "Исландия"] as const;
  const CERTIFICATE_OPTIONS = ["MSC", "ASC", "ISO", "HACCP"] as const;
  const dispatch = useDispatch();
  const {
    price: { min, max },
    onlyNew,
    onlyPromo,
    processing,
    packageTypes,
    origins,
    certificates,
  } = useSelector((state: RootState) => state.catalogFilters);

  // Временные границы. В дальнейшем возьмём реальные min/max из API.
  const PRICE_MIN = 0;
  const PRICE_MAX = 5000;

  const handlePriceChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      if (Array.isArray(newValue) && newValue.length === 2) {
        dispatch(setPrice({ min: newValue[0], max: newValue[1] }));
      }
    },
    [dispatch]
  );

  return (
    <Box paddingY={2}>
      <Stack spacing={3} width={{ xs: "100%", sm: 280 }}>
        {/* Диапазон цены */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Цена, ₽
          </Typography>
          <Slider
            value={[min || PRICE_MIN, max || PRICE_MAX]}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={100}
          />
        </Box>

        {/* Чекбоксы */}
        <FormControlLabel
          control={<Checkbox checked={onlyNew} onChange={() => dispatch(toggleOnlyNew())} />}
          label="Только новинки"
        />
        <FormControlLabel
          control={<Checkbox checked={onlyPromo} onChange={() => dispatch(toggleOnlyPromo())} />}
          label="Только акции"
        />
              {/* Multi-select filters */}
        <MultiSelectFilter
          label="Обработка"
          options={PROCESSING_OPTIONS}
          value={processing}
          onChange={(val) => dispatch(setProcessing(val as string[]))}
        />
        <MultiSelectFilter
          label="Тип упаковки"
          options={PACKAGE_TYPES}
          value={packageTypes}
          onChange={(val) => dispatch(setPackageTypes(val as string[]))}
        />
        <MultiSelectFilter
          label="Происхождение"
          options={ORIGIN_OPTIONS}
          value={origins}
          onChange={(val) => dispatch(setOrigins(val as string[]))}
        />
        <MultiSelectFilter
          label="Сертификаты"
          options={CERTIFICATE_OPTIONS}
          value={certificates}
          onChange={(val) => dispatch(setCertificates(val as string[]))}
        />

        {/* Переключатель вида и сброс */}
        <Divider />
        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Button size="small" variant="outlined" onClick={() => dispatch(resetFilters())}>
            Сбросить фильтры
          </Button>
          <ViewToggle />
        </Stack>
      </Stack>
    </Box>
  );
}
