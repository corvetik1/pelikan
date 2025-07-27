"use client";

import { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

export interface AdminPageHeadingProps {
  title: string;
  actions?: ReactNode;
}

/**
 * Reusable page heading for admin sections.
 * Renders h1 typography and optional action buttons on the right.
 */
export default function AdminPageHeading({
  title,
  actions,
}: AdminPageHeadingProps) {
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
      {actions && <Box>{actions}</Box>}
    </Stack>
  );
}
