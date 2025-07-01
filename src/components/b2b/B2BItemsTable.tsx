"use client";

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridCellEditStopParams,
} from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  removeItem,
  updateItemQuantity,
  type B2BCalculatorState,
} from "@/redux/b2bCalculatorSlice";
import { products } from "@/data/mock";

export default function B2BItemsTable() {
  const dispatch = useDispatch();
  const { items, prices }: B2BCalculatorState = useSelector(
    (s: RootState) => s.b2bCalculator
  );

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
      dispatch(updateItemQuantity({ id: params.id as string, quantity: Number(params.value) }));
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
      valueGetter: ({ row }: { row: { total: number } }) => row.total,
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
          onClick={() => dispatch(removeItem(params.id as string))}
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
