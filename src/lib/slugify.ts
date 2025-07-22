export function slugify(str: string): string {
  return str
    .trim()
    .toLowerCase()
    // Replace locale-specific chars (basic) – extend if needed
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    // Replace spaces with dash
    .replace(/\s+/g, '-')
    // Remove invalid chars
    .replace(/[^a-z0-9-]/g, '')
    // Collapse multiple dashes
    .replace(/-+/g, '-')
    // Trim dashes at ends
    .replace(/^-|-$/g, '');
}
