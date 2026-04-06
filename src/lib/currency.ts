export const currency = {
  symbol: 'FCFA',
  code: 'XAF',
  name: 'CFA Franc',
  locale: 'fr-CM',
};

export const formatPrice = (cents: number): string => {
  const amount = cents / 100;
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
  }).format(amount);
};
