/**
 * Leaflet icon paths fix for Next.js/Webpack environments.
 * Подключите один раз в приложении: `import '@/utils/leaflet'`.
 */
// Fix Leaflet icons and avoid SSR crashes.
// Only execute in the browser because Leaflet expects `window`.
if (typeof window !== 'undefined') {
  void import('leaflet').then((leafletMod) => {
    const L = (leafletMod as typeof import('leaflet'));
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  });
}

export {};
