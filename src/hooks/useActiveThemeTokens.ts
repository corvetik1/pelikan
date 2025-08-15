import { useGetSettingsQuery, useGetAdminThemesQuery } from "@/redux/api";
import type { ThemeOptions } from "@mui/material/styles";

/**
 * Returns tokens of the currently active theme from Settings.
 * Falls back to undefined until both requests are resolved.
 */
function isThemeOptions(obj: object): obj is ThemeOptions {
  return (
    // minimal shape guard for our tokens validated by themeTokensSchema
    'palette' in obj &&
    'typography' in obj
  );
}

export function useActiveThemeTokens(): ThemeOptions | undefined {
  const { data: settings } = useGetSettingsQuery();
  const activeSlug = settings?.activeThemeSlug;

  const { data: themes } = useGetAdminThemesQuery(undefined, { skip: !activeSlug });

  const raw = themes?.find((t) => t.slug === activeSlug)?.tokens;
  if (raw && typeof raw === 'object' && isThemeOptions(raw)) return raw;
  return undefined;
}
