"use client";

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridCellEditStopParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";

import { products } from "@/data/mock";

export interface B2BItemsTableProps {
  items: Array<{ id: string; quantity: number }>;
  prices: Record<string, number>;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export default function B2BItemsTable({ items, prices, onRemove, onQuantityChange }: B2BItemsTableProps) {
  

  const rows = items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    const unitPrice = prices[item.id] ?? product?.price ?? 0;
    return {
      id: item.id,
      name: product?.name ?? item.id,
      unitPrice,
      quantity: item.quantity,
      total: unitPrice * item.quantity,
    };
  });

  const handleEditStop = (params: GridCellEditStopParams) => {
    if (params.field === "quantity") {
      onQuantityChange(String(params.id), Number(params.value));
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Товар", flex: 1, minWidth: 200 },
    {
      field: "unitPrice",
      headerName: "Цена, ₽",
      width: 120,
      valueFormatter: ({ value }: { value: number | string }) => Number(value).toLocaleString(),
    },
    {
      field: "quantity",
      headerName: "Кол-во",
      width: 110,
      editable: true,
    },
    {
      field: "total",
      headerName: "Сумма, ₽",
      width: 130,
      valueGetter: ({ row }: GridValueGetterParams) => {
        if (!row) return 0;
        // fallback compute if "total" is missing
        if (typeof row.total === "number") return row.total;
        const unit = Number(row.unitPrice) || 0;
        const qty = Number(row.quantity) || 0;
        return unit * qty;
      },
      valueFormatter: ({ value }: { value: number | string }) => Number(value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "",
      width: 60,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          size="small"
          aria-label="delete-item"
          onClick={() => onRemove(params.id as string)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      density="compact"
      hideFooterSelectedRowCount
      onCellEditStop={handleEditStop}
      pageSizeOptions={[5, 10]}
      initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
    />
  );
}
