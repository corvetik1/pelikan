"use client";

import { Chip } from "@mui/material";
import dayjs from "dayjs";
import AdminDataGrid from "@/components/admin/AdminDataGrid";
import type { AdminNews } from "@/types/admin";
import type { GridColDef } from "@mui/x-data-grid";

interface NewsTableProps {
  rows: AdminNews[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<AdminNews>) => void;
}

/**
 * Таблица новостей с красивыми ячейками: дата форматируется, категория отображается Chip.
 */
export default function NewsTable({ rows, loading = false, onDelete, onUpdate }: NewsTableProps) {
  const columns: GridColDef[] = [
    {
      field: "img",
      headerName: "Фото",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={(params.value as string) || "/placeholder.png"}
          alt="thumb"
          width={40}
          height={40}
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      field: "title",
      headerName: "Заголовок",
      flex: 2,
      editable: true,
    },
    {
      field: "excerpt",
      headerName: "Анонс",
      flex: 3,
      editable: true,
    },
    {
      field: "date",
      headerName: "Дата",
      width: 140,
      editable: true,
      valueGetter: (params: { value?: unknown }) =>
        params.value ? dayjs(String(params.value)).format("DD.MM.YYYY") : "",
    },
    {
      field: "category",
      headerName: "Категория",
      width: 160,
      editable: false,
      valueGetter: ({ row }: { row: AdminNews }) => row.category?.title ?? '',
      renderCell: (params) => <Chip label={params.value} size="small" variant="outlined" />,
    },
  ];

  return (
    <AdminDataGrid<AdminNews>
      rows={rows}
      columns={columns}
      loading={loading}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  );
}
