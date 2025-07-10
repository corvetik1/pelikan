export interface Product {
  /** Unique identifier */
  id: string;
  name: string;
  /** URL-friendly slug */
  slug: string;
  /** Base price (RUB) */
  price: number;
  /** Display weight label, e.g. "500 г" */
  weight: string;
  /** Category slug: red, white, seafood, etc. */
  category: string;
  /** Main image URL */
  img: string;
  /** Optional additional images */
  images?: string[];
  /** Description (HTML or plain) */
  description: string;
  /** Processing type */
  processing?: 'fresh' | 'frozen' | 'salted' | 'smoked';
  /** Package weight, grams */
  packageWeight?: number;
  /** Package type */
  packageType?: string;
  /** Region of origin */
  origin?: string;
  /** Certificates */
  certificates?: string[];
  /** Promo flag */
  isPromo?: boolean;
  /** Whether item is new */
  isNew?: boolean;
  /** Created ISO timestamp */
  createdAt?: string;
}
