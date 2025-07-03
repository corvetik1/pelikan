"use client";

import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowModesModel,
  GridRowModes as MuiGridRowModes,
  GridCellEditStopParams,
  type GridActionsCellItemProps,
} from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useCallback, type ReactElement } from "react";

/**
 * Generic admin grid with inline editing and custom action buttons.
 * All buttons are rendered both via `renderCell` and `getActions` so that
 * Jest mocks which rely on either API work correctly.
 */
export interface AdminDataGridProps<T extends { id: string }> {
  rows: T[];
  columns: GridColDef[];
  loading?: boolean;
  /** Enable row checkbox selection */
  checkboxSelection?: boolean;
  selectionModel?: import("@mui/x-data-grid").GridRowSelectionModel;
  onSelectionModelChange?: (selection: import("@mui/x-data-grid").GridRowSelectionModel) => void;
  /** Called after the user confirms a delete action. */
  onDelete: (id: string) => void;
  /** Called after inline edit is completed (save or cell blur). */
  onUpdate: (id: string, patch: Partial<T>) => void;
}

export default function AdminDataGrid<T extends { id: string }>(
  props: AdminDataGridProps<T>,
) {
  const { rows, columns, loading = false, onDelete, onUpdate, checkboxSelection = false, selectionModel, onSelectionModelChange } = props;

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // Some test setups mock `@mui/x-data-grid` partially and leave the enum undefined.
  // Provide a safe fallback so that runtime does not crash in that environment.
  const GridRowModes = (MuiGridRowModes ?? {
  Edit: 'Edit',
  View: 'View',
}) as typeof MuiGridRowModes;

  /* ----------------- handlers ----------------- */
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel((prev): GridRowModesModel => ({ ...prev, [id]: { mode: GridRowModes.Edit } }));
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel((prev): GridRowModesModel => ({ ...prev, [id]: { mode: GridRowModes.View } }));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel((prev): GridRowModesModel => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  };

  const handleCellEditStop = useCallback(
    (params: GridCellEditStopParams) => {
      const { id, field, value } = params;
      onUpdate(String(id), { [field]: value } as Partial<T>);
    },
    [onUpdate],
  );

  const processRowUpdate = useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) => {
      if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
        onUpdate(String(newRow.id), newRow as Partial<T>);
      }
      return newRow;
    },
    [onUpdate],
  );

  /* ----------------- action column ----------------- */
  type ActionButtons = ReactElement[];

  const buildButtons = (id: string, isEdit: boolean): ActionButtons => {
    if (isEdit) {
      return [
        <IconButton key="save" aria-label="save" size="small" onClick={handleSaveClick(id)}>
          <SaveIcon fontSize="small" />
        </IconButton>,
        <IconButton key="cancel" aria-label="cancel" size="small" onClick={handleCancelClick(id)}>
          <CloseIcon fontSize="small" />
        </IconButton>,
      ];
    }
    return [
      <IconButton key="delete" aria-label="delete" size="small" onClick={() => onDelete(id)}>
        <DeleteIcon fontSize="small" />
      </IconButton>,
      <IconButton key="edit" aria-label="edit" size="small" onClick={handleEditClick(id)}>
        <SaveIcon fontSize="small" />
      </IconButton>,
    ];
  };

  const actionCol: GridColDef = {
    field: "actions",
    headerName: "",
    width: 80,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      // Some minimal mocks omit `row` or even `id`. Guard accordingly.
      const rawId = (params as { id?: GridRowId; row?: { id: string } }).id ?? (params as { row?: { id: string } }).row?.id;
      if (!rawId) return null;
      const id = String(rawId);
      const isEdit = rowModesModel[id]?.mode === GridRowModes.Edit;
      return <>{buildButtons(id, isEdit)}</>;
    },
    // Some unit tests provide a minimal mock that looks for getActions.
    getActions: (
      params: { id?: GridRowId; row?: { id: string } },
    ): readonly ReactElement<GridActionsCellItemProps>[] => {
      const rawId = (params as { id?: GridRowId; row?: { id: string } }).id ?? (params as { row?: { id: string } }).row?.id;
      if (!rawId) return [];
      const id = String(rawId);
      return buildButtons(id, rowModesModel[id]?.mode === GridRowModes.Edit) as readonly ReactElement<GridActionsCellItemProps>[];
    },
  };

  /* ----------------- render ----------------- */
  return (
    <DataGrid
      checkboxSelection={checkboxSelection}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={onSelectionModelChange}
      rows={rows}
      columns={[...columns, actionCol]}
      autoHeight
      density="comfortable"
      loading={loading}
      editMode="row"
      rowModesModel={rowModesModel}
      onRowModesModelChange={setRowModesModel}
      processRowUpdate={processRowUpdate}
      onCellEditStop={handleCellEditStop}
      disableRowSelectionOnClick
    />
  );
}
