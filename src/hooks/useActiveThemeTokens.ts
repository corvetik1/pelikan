import { useGetSettingsQuery, useGetAdminThemesQuery } from "@/redux/api";

/**
 * Returns tokens of the currently active theme from Settings.
 * Falls back to undefined until both requests are resolved.
 */
export function useActiveThemeTokens(): Record<string, unknown> | undefined {
  const { data: settings } = useGetSettingsQuery();
  const activeSlug = settings?.activeThemeSlug;

  const { data: themes } = useGetAdminThemesQuery(undefined, { skip: !activeSlug });

  return themes?.find((t) => t.slug === activeSlug)?.tokens as Record<string, unknown> | undefined;
}
