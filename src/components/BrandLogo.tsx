"use client";

import React from "react";
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
  /** Optional logo src (can be external URL); fallback to /logo.svg */
  src?: string | null;
  /** Optional alt text */
  alt?: string;
}

/**
 * Brand logo component (40×40, 12 px radius fish icon)
 */
export default function BrandLogo({ sx = {}, size = 40, disableLink = false, src, alt }: BrandLogoProps): React.JSX.Element {
  const finalSrc: string = src && src.length > 0 ? src : "/logo.svg";
  const finalAlt: string = alt && alt.length > 0 ? alt : "Бухта пеликанов";

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
      {/* Use priority for above-the-fold render in header; unoptimized to support remote URLs without next/image domain config */}
      <Image src={finalSrc} alt={finalAlt} width={size} height={size} priority unoptimized />
    </Box>
  );

  return disableLink ? img : <Link href="/">{img}</Link>;
}
