"use client";

import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import dynamic from "next/dynamic";
const StoreMap = dynamic(() => import("@/components/stores/StoreMap"), { ssr: false });
import { useGetAdminStoresQuery } from "@/redux/api";

export default function StoresSection() {
  const { data = [], isLoading } = useGetAdminStoresQuery();
  const stores = data.slice(0, 5);

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Где купить
      </Typography>
      {isLoading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : (
        <StoreMap stores={stores} zoom={5} />
      )}
    </Box>
  );
}
