"use client";

import Image from "next/image";
import Link from "next/link";
import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface BrandLogoProps {
  /** Optional sx overrides for container */
  sx?: SxProps<Theme>;
  /** Width/height, default 40 */
  size?: number;
  /** Whether to hide link wrapper (e.g. inside next/link already) */
  disableLink?: boolean;
}

/**
 * Brand logo component (40×40, 12 px radius fish icon)
 */
export default function BrandLogo({ sx = {}, size = 40, disableLink = false }: BrandLogoProps) {
  const img = (
    <Box
      sx={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: 2, // 12px on 40px → radius = 12 = size * 0.3; here we keep constant px for simplicity
        overflow: "hidden",
        ...sx,
      }}
    >
      {/* Use priority for above-the-fold render in header */}
      <Image src="/logo.svg" alt="Бухта пеликанов" width={size} height={size} priority />
    </Box>
  );

  return disableLink ? img : <Link href="/">{img}</Link>;
}
