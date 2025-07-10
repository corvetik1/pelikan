"use client";

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridCellEditStopParams,
} from "@mui/x-data-grid";


interface Row {
  id: string;
}

interface B2BRow extends Row {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface B2BItemsTableProps {
  items: Array<{ id: string; quantity: number }>;
  prices: Record<string, number>;
  names: Record<string, string>;
  showPrices?: boolean;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export default function B2BItemsTable({ items, prices, names, showPrices = true, onRemove, onQuantityChange }: B2BItemsTableProps) {

  

      const rows: B2BRow[] = items.map((item) => {
    const unitPrice = prices[item.id] ?? 0;
    return {
      id: item.id,
      name: names[item.id] ?? item.id,
      unitPrice,
      quantity: item.quantity,
      total: unitPrice * item.quantity,
    };
  });

    const handleEditStop = (params: GridCellEditStopParams<B2BRow>) => {
    if (params.field === "quantity") {
      onQuantityChange(String(params.id), Number(params.value));
    }
  };

    const baseColumns: GridColDef<B2BRow>[] = [
    { field: "name", headerName: "Товар", flex: 1, minWidth: 200 },
    {
      field: "unitPrice",
      headerName: "Цена, ₽",
      width: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: ({ value }: { value: number | string }) => Number(value).toLocaleString(),
    },
    {
      field: "quantity",
      headerName: "Кол-во",
      width: 110,
      align: "right",
      headerAlign: "right",
      editable: true,
    },
    {
      field: "total",
      headerName: "Сумма, ₽",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueGetter: (_value, row) => {
        const r = row as B2BRow;
        if (!r) return 0;
        if (typeof r.total === "number") return r.total;
        return (Number(r.unitPrice) || 0) * (Number(r.quantity) || 0);
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

  const columns = showPrices ? baseColumns : baseColumns.filter((c) => !['unitPrice', 'total'].includes(c.field as string));

  return (
    <DataGrid<B2BRow>
      rows={rows}
      columns={columns}
      autoHeight
      density="compact"
      hideFooterSelectedRowCount
      hideFooterPagination={rows.length < 5}
      onCellEditStop={handleEditStop}
      pageSizeOptions={[5, 10]}
      initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
    />
  );
}
