export type IconName = 'EmojiEvents' | 'People' | 'Verified' | 'Factory';

export interface Advantage {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName; // имя иконки MUI
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export type AdvantagePatch = Partial<Pick<Advantage, 'title' | 'subtitle' | 'icon' | 'order'>>;
