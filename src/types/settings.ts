export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

export type ContactType = 'phone' | 'email' | 'address' | 'link';

export interface ContactItem {
  id: string;
  type: ContactType;
  label?: string;
  value: string;
}

export interface Settings {
  activeThemeSlug: string;
  logoUrl?: string | null;
  heroSpeedMs: number;
  socials: SocialLink[];
  contacts: ContactItem[];
  /** Optional URL to the current price list for CTA download */
  priceListUrl?: string | null;
  /** Homepage CTA title */
  ctaTitle?: string | null;
  /** Homepage CTA subtitle */
  ctaSubtitle?: string | null;
  /** Homepage News section title */
  homeNewsTitle?: string | null;
  /** Homepage Recipes section title */
  homeRecipesTitle?: string | null;
}
