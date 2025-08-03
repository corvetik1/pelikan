"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import RequirePermission from '@/components/RBAC/RequirePermission';
import AdminPageHeading from "@/components/admin/AdminPageHeading";
import ViewToggle from '@/components/admin/ViewToggle';
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useState, useMemo } from "react";
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/redux/snackbarSlice';
import { GridColDef } from "@mui/x-data-grid";
import AdminDataGrid from "@/components/admin/AdminDataGrid";
import ProductCard from '@/components/products/ProductCard';
import { useViewMode } from '@/hooks/useViewMode';

import { useGetAdminProductsQuery, useCreateProductMutation, useUpdateAdminProductMutation, useDeleteProductMutation } from "@/redux/adminApi";

import AddProductDialog from "@/components/admin/AddProductDialog";
import ImportProductsDialog from '@/components/admin/ImportProductsDialog';
import type { AdminProduct } from "@/types/admin";
import type { Product } from "@/types/product";

const baseColumns: GridColDef[] = [
  {
    field: "img",
    headerName: "Фото",
    width: 80,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={params.value || "/placeholder.png"}
        alt="thumb"
        width={40}
        height={40}
        style={{ objectFit: "cover", borderRadius: 4 }}
      />
    ),
  },
  { field: "id", headerName: "ID", width: 110 },
  { field: "name", headerName: "Название", flex: 1, minWidth: 200, editable: true },
  {
    field: "price",
    headerName: "Цена, ₽",
    width: 130,
    editable: true,
    valueFormatter: (value: number) =>
      (value as number).toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      }),
  },
  { field: "weight", headerName: "Вес", width: 120, editable: true },
  { field: "category", headerName: "Категория", width: 150, editable: true },
];

type MutationResult = Promise<unknown> & { unwrap?: () => Promise<unknown> };

async function resolveMutation(res: MutationResult | undefined): Promise<void> {
  if (!res) {
    return;
  }
  if (typeof res.unwrap === "function") {
    await res.unwrap();
  } else {
    await res;
  }
}

export default function AdminProductsPage() {
  const [viewMode] = useViewMode('products');
  // Мемоизируем аргументы, иначе при каждом рендере создаётся новый объект → RTK Query считает, что аргументы изменились, и перефечивает данные бесконечно (что ломало E2E во 2-й вкладке).
  const queryArgs = useMemo(() => ({}), []);
  const { data = [], isLoading, isError, refetch } = useGetAdminProductsQuery(queryArgs);
  const dispatch = useDispatch();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateAdminProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [openAdd, setOpenAdd] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  

  const handleAdd = async (payload: Partial<AdminProduct>) => {
    try {
      await resolveMutation(createProduct(payload));
      setOpenAdd(false);
      refetch();
      dispatch(showSnackbar({ message: 'Товар создан', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка создания', severity: 'error' }));
    }
  };

  const handleUpdate = async (id: string, patch: Partial<AdminProduct>) => {
    try {
      await resolveMutation(updateProduct({ id, patch }));
      refetch();
      dispatch(showSnackbar({ message: 'Изменено', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка изменения', severity: 'error' }));
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await resolveMutation(deleteProduct(deleteId));
      refetch();
      dispatch(showSnackbar({ message: 'Удалено', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка удаления', severity: 'error' }));
    } finally {
      setDeleteId(null);
    }
  };

  const columns: GridColDef[] = baseColumns;

  
  if (isError || !data) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Typography>Ошибка загрузки товаров</Typography>
        <Button variant="contained" onClick={() => refetch()}>Повторить</Button>
      </Stack>
    );
  }

  return (
    <Box>
      <AdminPageHeading
        title="Товары"
        actions={
          <Stack direction="row" spacing={1} alignItems="center">
            <ViewToggle section="products" />
            <RequirePermission permission="products:create">
              <Button variant="contained" size="small" onClick={() => setOpenAdd(true)}>
              + Добавить
             </Button>
            </RequirePermission>
             <RequirePermission permission="products:import">
              <Button variant="outlined" size="small" onClick={() => setOpenImport(true)}>
               Импорт
             </Button>
            </RequirePermission>
          </Stack>
        }
      />
      {viewMode === 'list' ? (
        <AdminDataGrid
          rows={data as AdminProduct[]}
          columns={columns}
          loading={isLoading}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {(data as AdminProduct[]).map((p) => (
            <Box key={p.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' } }}>
              <ProductCard product={p as unknown as Product} />
            </Box>
          ))}
        </Box>
      )}
      <AddProductDialog open={openAdd} onClose={() => setOpenAdd(false)} onCreate={handleAdd} />
      {openImport && (
        <ImportProductsDialog open={openImport} onClose={() => setOpenImport(false)} />
      )}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Удалить товар?"
        description="Действие необратимо."
        confirmText="Удалить"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
      
        
          
        
      
    </Box>
  );
}
