"use client";

import { Box, Paper, Typography } from "@mui/material";
import { ReactElement } from "react";

interface StatsCardProps {
  icon: ReactElement;
  title: string;
  value: React.ReactNode;
  trend?: number; // positive => up, negative => down
  color?: "primary" | "secondary" | "success" | "error" | "warning";
}

export default function StatsCard({ icon, title, value, trend, color = "primary" }: StatsCardProps) {
  const trendColor = trend === undefined ? undefined : trend >= 0 ? "success.main" : "error.main";
  const trendIcon = trend === undefined ? null : trend >= 0 ? "\u2191" : "\u2193";

  return (
    <Paper
      elevation={1}
      sx={{ p: 3, display: "flex", justifyContent: "space-between", border: 1, borderColor: "divider", borderRadius: 2 }}
    >
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ mt: 0.5 }}>
          {value}
        </Typography>
        {trend !== undefined && (
          <Typography variant="body2" sx={{ color: trendColor, display: "flex", alignItems: "center", mt: 0.5 }}>
            {trendIcon} {Math.abs(trend).toFixed(1)}%
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: (theme) =>
            color === 'primary'
              ? 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)'
              : `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
          color: "common.white",
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}
