"use client";

import { ReactNode, ReactElement } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import RequirePermission from '@/components/RBAC/RequirePermission';

export interface AdminPageHeadingProps {
  title: string;
  /** Если использовать старый способ (передать actions напрямую) */
  actions?: ReactNode;
  /** Новый API: кнопка «Добавить» */
  onCreate?: () => void;
  createPerm?: string;
  createDisabled?: boolean;
  createLabel?: string;
  /** Кнопка «Импорт» */
  onImport?: () => void;
  importPerm?: string;
  importDisabled?: boolean;
  importLabel?: string;
  /** Кнопка «Удалить выбранные» */
  onBulkDelete?: () => void;
  bulkDeletePerm?: string;
  bulkDeleteDisabled?: boolean;
  bulkDeleteLabel?: string;
}

/**
 * Reusable page heading for admin sections.
 * Renders h1 typography and optional action buttons on the right.
 */
export default function AdminPageHeading({
  title,
  actions,
  onCreate,
  createPerm,
  createDisabled = false,
  createLabel = '+ Добавить',
  onImport,
  importPerm,
  importDisabled = false,
  importLabel = 'Импорт',
  onBulkDelete,
  bulkDeletePerm,
  bulkDeleteDisabled = false,
  bulkDeleteLabel = 'Удалить выбранные',
}: AdminPageHeadingProps): ReactElement {
  return (
    <Stack sx={{ position: 'relative', zIndex: (theme) => theme.zIndex.drawer + 2 }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={3}
    >
      <Typography component="h1" variant="h5" fontWeight={600} noWrap>
        {title}
      </Typography>
      {/* Новый API */}
      <Stack direction="row" spacing={1} alignItems="center">
        {onCreate && createPerm && (
          <RequirePermission permission={createPerm}>
            <Button
              variant="contained"
              size="small"
              onClick={onCreate}
              disabled={createDisabled}
              data-testid="create-action"
            >
              {createLabel}
            </Button>
          </RequirePermission>
        )}
        {onImport && importPerm && (
          <RequirePermission permission={importPerm}>
            <Button
              variant="outlined"
              size="small"
              onClick={onImport}
              disabled={importDisabled}
              data-testid="import-action"
            >
              {importLabel}
            </Button>
          </RequirePermission>
        )}
        {onBulkDelete && bulkDeletePerm && (
          <RequirePermission permission={bulkDeletePerm}>
            <Button
              variant="outlined"
              size="small"
              onClick={onBulkDelete}
              disabled={bulkDeleteDisabled}
              data-testid="bulk-delete-action"
            >
              {bulkDeleteLabel}
            </Button>
          </RequirePermission>
        )}
        {/* Старый API */}
        {actions && <Box>{actions}</Box>}
      </Stack>
    </Stack>
  );
}
