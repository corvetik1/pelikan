export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  createdAt?: string;
  updatedAt?: string;
}

export type HeroPatch = Partial<Pick<HeroSlide, 'title' | 'subtitle' | 'img'>>;
