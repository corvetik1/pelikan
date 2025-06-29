/**
 * Контактные данные и реквизиты компании.
 */
export interface CompanyInfo {
  name: string;
  legalName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
}

export const company: CompanyInfo = {
  name: 'ООО «Меридиан»',
  legalName: 'Общество с ограниченной ответственностью «Меридиан»',
  inn: '7801234567',
  kpp: '780101001',
  ogrn: '1187847260001',
  address: '197022, г. Санкт-Петербург, ул. Профессора Попова, д. 37',
  phone: '+7 (812) 123-45-67',
  email: 'info@meridian.ru',
  lat: 59.9703,
  lng: 30.3116,
};
