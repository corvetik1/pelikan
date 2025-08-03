"use client";

import React from "react";
import { useSelector } from "react-redux";
import { selectHasPermission } from "@/redux/authSlice";

interface RenderVariantProps {
  variant?: "render";
  /** Element rendered when permission denied (defaults to null) */
  fallback?: React.ReactNode;
}

interface DisableVariantProps {
  variant: "disable";
  /** fallback not allowed for disable variant */
  fallback?: never;
}

export type RequirePermissionProps =
  | ({ permission: string; children: React.ReactNode } & RenderVariantProps)
  | ({ permission: string; children: React.ReactElement } & DisableVariantProps);

/**
 * Client-side RBAC guard.
 *
 * Usage examples:
 *  1. Hide element completely if no permission:
 *     <RequirePermission permission="news:create"> <Button>Add</Button> </RequirePermission>
 *
 *  2. Render fallback:
 *     <RequirePermission permission="news:create" fallback={<span>No access</span>}>
 *        <Button>Add</Button>
 *     </RequirePermission>
 *
 *  3. Disable element instead of hiding:
 *     <RequirePermission variant="disable" permission="news:create">
 *        <Button>Add</Button>
 *     </RequirePermission>
 */
export default function RequirePermission(props: RequirePermissionProps) {
  const allowed = useSelector(selectHasPermission(props.permission));

  if (props.variant === "disable") {
    const child = (props.children as React.ReactElement<unknown>) || null;
    if (!React.isValidElement(child)) {
      if (process.env.NODE_ENV !== "production") {
        console.error("RequirePermission: 'disable' variant expects a single React element child");
      }
      return null;
    }
    return React.cloneElement(child, { disabled: !allowed } as { disabled?: boolean });
  }

  // "render" variant (default)
  if (allowed) {
    return <>{props.children}</>;
  }
  return <>{props.fallback ?? null}</>;
}
