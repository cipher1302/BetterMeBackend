import fs from 'node:fs';

const taxRates = JSON.parse(
  fs.readFileSync(new URL('../../new-york-tax-rates.json', import.meta.url))
);

function calculateTax(subtotal, countyName) {
  const rates = taxRates[countyName];
  
  if (!rates) throw new Error(`No tax rates for county ${countyName}`);

  const compositeRate = rates.state_rate + rates.county_rate + rates.city_rate + rates.special_rate;
  const taxAmount = subtotal * compositeRate;
  const totalAmount = subtotal + taxAmount;

  return {
    composite_tax_rate: compositeRate,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    breakdown: {
      state_rate: rates.state_rate,
      county_rate: rates.county_rate,
      city_rate: rates.city_rate,
      special_rate: rates.special_rate
    }
  };
}
export default calculateTax