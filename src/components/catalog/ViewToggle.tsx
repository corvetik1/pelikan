"use client";

import { IconButton, Tooltip } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setViewMode, ViewMode } from "@/redux/catalogFiltersSlice";
import type { RootState } from "@/redux/store";

/** Toggle between grid and list view modes using icons. */
export default function ViewToggle() {
  const dispatch = useDispatch();
  const viewMode = useSelector((state: RootState) => state.catalogFilters.viewMode);

  const handleToggle = useCallback(() => {
    const next: ViewMode = viewMode === "grid" ? "list" : "grid";
    dispatch(setViewMode(next));
  }, [dispatch, viewMode]);

  return (
    <Tooltip title={viewMode === "grid" ? "Список" : "Сетка"}>
      <IconButton onClick={handleToggle} size="large" aria-label={viewMode === 'grid' ? 'Список' : 'Сетка'}>
        {viewMode === "grid" ? <ViewListIcon /> : <GridViewIcon />}
      </IconButton>
    </Tooltip>
  );
}
