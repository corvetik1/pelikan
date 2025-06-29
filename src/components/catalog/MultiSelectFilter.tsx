"use client";

import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback } from "react";

/**
 * Generic multi-select filter component with checkboxes in menu items.
 * Fully typed, strict TS.
 */
export interface MultiSelectFilterProps<Option extends string> {
  label: string;
  options: readonly Option[];
  value: readonly Option[];
  onChange: (newValue: Option[]) => void;
  // Optional: minWidth for layout tweaks
  minWidth?: number;
  /** Optional custom id base for label & select (accessibility) */
  id?: string;
}

export default function MultiSelectFilter<Option extends string>(
  props: MultiSelectFilterProps<Option>,
) {
  const { label, options, value, onChange, minWidth = 200, id } = props;
  const baseId = id ?? label.replace(/\s+/g, '-').toLowerCase();
  const labelId = `${baseId}-label`;
  const selectId = `${baseId}-select`;

  const handleChange = useCallback(
    (event: SelectChangeEvent<readonly string[]>) => {
      const {
        target: { value: selected },
      } = event;
      // selected can be string[] or string due to MUI type
      const newValue: Option[] = Array.isArray(selected)
        ? (selected as Option[]).slice()
        : (selected as string).split(',') as Option[];
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <FormControl size="small" sx={{ minWidth }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
          id={selectId}
          labelId={labelId}
        multiple
        value={value as readonly string[]}
        onChange={handleChange}
        label={label}
        renderValue={(selected) => (selected as string[]).join(', ')}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.includes(option)} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
