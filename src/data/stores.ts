/**
 * Мок-данные магазинов для раздела «Где купить»
 */
export interface Store {
  /** Уникальный идентификатор */
  id: string;
  /** Название магазина/партнёра */
  name: string;
  /** Адрес */
  address: string;
  /** Широта */
  lat: number;
  /** Долгота */
  lng: number;
  /** Регион (для фильтра) */
  region: string;
  /** URL логотипа */
  logo?: string;
}

export const stores: Store[] = [
  {
    id: 's1',
    name: 'ОкеанМаркет – Невский',
    address: 'Невский пр., 120, Санкт-Петербург',
    lat: 59.9311,
    lng: 30.3609,
    region: 'Санкт-Петербург',
    logo: '/stores/oceanmarket.png',
  },
  {
    id: 's2',
    name: 'Морская Лавка – Василеостровская',
    address: 'Средний пр. В.О., 52, Санкт-Петербург',
    lat: 59.9435,
    lng: 30.2791,
    region: 'Санкт-Петербург',
    logo: '/stores/sea-shop.png',
  },
  {
    id: 's3',
    name: 'Рыбный мир – Новосибирск',
    address: 'Красный проспект, 75, Новосибирск',
    lat: 55.0415,
    lng: 82.9346,
    region: 'Новосибирск',
  },
  {
    id: 's4',
    name: 'FISH & MORE – Москва',
    address: 'Тверская ул., 14, Москва',
    lat: 55.7575,
    lng: 37.6131,
    region: 'Москва',
  },
];
