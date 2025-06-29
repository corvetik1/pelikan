"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { useCallback } from "react";

export type SortOption = "default" | "priceAsc" | "priceDesc" | "newFirst";

export interface ProductsFilterState {
  sort: SortOption;
  onlyNew: boolean;
}

interface ProductsFiltersProps {
  value: ProductsFilterState;
  onChange: (state: ProductsFilterState) => void;
}

export default function ProductsFilters({ value, onChange }: ProductsFiltersProps) {
  const handleSortChange = useCallback(
    (event: SelectChangeEvent<SortOption>) => {
      onChange({ ...value, sort: event.target.value as SortOption });
    },
    [onChange, value]
  );

  const handleOnlyNewChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, onlyNew: event.target.checked });
    },
    [onChange, value]
  );

  return (
    <Box paddingY={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="sort-label">Сортировка</InputLabel>
          <Select<SortOption>
            labelId="sort-label"
            value={value.sort}
            label="Сортировка"
            onChange={handleSortChange}
          >
            <MenuItem value="default">По умолчанию</MenuItem>
            <MenuItem value="priceAsc">Цена ↑</MenuItem>
            <MenuItem value="priceDesc">Цена ↓</MenuItem>
            <MenuItem value="newFirst">Сначала новинки</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Checkbox checked={value.onlyNew} onChange={handleOnlyNewChange} />}
          label="Только новинки"
        />
      </Stack>
    </Box>
  );
}
