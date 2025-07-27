"use client";

import { IconButton, Tooltip } from "@mui/material";
import { ViewMode, useViewMode } from "@/hooks/useViewMode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList } from "@fortawesome/free-solid-svg-icons";

export interface ViewToggleProps {
  /** Имя раздела для сохранения состояния в localStorage */
  section: string;
  /** Callback при изменении режима */
  onChange?: (mode: ViewMode) => void;
  /** Размер иконок, по умолчанию '1x' */
  size?: "sm" | "md" | "lg";
}

const iconSizeMap = {
  sm: "xs",
  md: "sm",
  lg: "1x",
} as const;

/**
 * Переключатель вида (Сетка / Список) согласно ТЗ.
 * – Иконки FontAwesome (`fa-th-large`, `fa-list`).
 * – WCAG: aria-label, focus-ring, tooltip.
 * – Сохраняет состояние в localStorage.viewMode[section].
 */
export default function ViewToggle({ section, onChange, size = "md" }: ViewToggleProps) {
  const [mode, setMode] = useViewMode(section);

  const handle = (m: ViewMode) => {
    setMode(m);
    onChange?.(m);
  };

  const iconSize = iconSizeMap[size];

  return (
    <>
      <Tooltip title="Сетка" arrow>
        <span>
          <IconButton
            aria-label="Сетка"
            color={mode === "grid" ? "primary" : "default"}
            onClick={() => handle("grid")}
            size="small"
          >
            <FontAwesomeIcon icon={faThLarge} size={iconSize} fixedWidth />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Список" arrow>
        <span>
          <IconButton
            aria-label="Список"
            color={mode === "list" ? "primary" : "default"}
            onClick={() => handle("list")}
            size="small"
          >
            <FontAwesomeIcon icon={faList} size={iconSize} fixedWidth />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}
