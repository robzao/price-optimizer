const productCostInput = document.getElementById('product-cost');
const shippingCostInput = document.getElementById('shipping-cost');
const marketingCostInput = document.getElementById('marketing-cost');
const otherCostsInput = document.getElementById('other-costs');
const platformFeeRateInput = document.getElementById('platform-fee-rate');
const paymentFeeRateInput = document.getElementById('payment-fee-rate');
const otherFeeRateInput = document.getElementById('other-fee-rate');
const taxRateInput = document.getElementById('tax-rate');
const profitMarginInput = document.getElementById('profit-margin');
const discountRateInput = document.getElementById('discount-rate');
const suggestedPriceDisplay = document.getElementById('suggested-price');
const discountedPriceDisplay = document.getElementById('discounted-price');
const netProfitDisplay = document.getElementById('net-profit');
const netMarginDisplay = document.getElementById('net-margin');

const formatCurrency = (value) => `$ ${value.toFixed(2)}`;
const formatPercentage = (value) => `${value.toFixed(2)}%`;

const sanitizeInput = (rawValue) => {
  const value = rawValue.replace(/[^\d.]/g, '');
  const parts = value.split('.');
  return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : value;
};

const parseValue = (sanitizedValue) => {
  const numericValue = parseFloat(sanitizedValue);
  return isNaN(numericValue) ? 0 : numericValue;
};

const calculate = (
  productCost, shippingCost, marketingCost, otherCosts,
  platformFeeRate, paymentFeeRate, otherFeeRate, taxRate,
  profitMarginRate, discountRate
) => {
  const totalCost = productCost + shippingCost + marketingCost + otherCosts;
  const totalFeeRate = platformFeeRate + paymentFeeRate + otherFeeRate + taxRate;
  const revenueFraction = 1 - totalFeeRate;

  if (revenueFraction <= 0) {
    return { suggestedPrice: 0, discountedPrice: 0, netProfit: 0, netMargin: 0 };
  }
  const desiredRevenue = totalCost * (1 + profitMarginRate);
  const suggestedPrice = desiredRevenue / revenueFraction;
  
  const discountedPrice = suggestedPrice * (1 - discountRate);

  const platformFee = discountedPrice * platformFeeRate;
  const paymentFee = discountedPrice * paymentFeeRate;
  const otherFee = discountedPrice * otherFeeRate;
  const tax = discountedPrice * taxRate;
  
  const totalExpenses = totalCost + platformFee + paymentFee + otherFee + tax;
  const netProfit = discountedPrice - totalExpenses;
  
  const netMargin = (discountedPrice === 0) ? 0 : (netProfit / discountedPrice) * 100;

  return { suggestedPrice, discountedPrice, netProfit, netMargin };
};

const updateDisplay = (result) => {
  suggestedPriceDisplay.textContent = formatCurrency(result.suggestedPrice);
  discountedPriceDisplay.textContent = formatCurrency(result.discountedPrice);
  netProfitDisplay.textContent = formatCurrency(result.netProfit);
  netMarginDisplay.textContent = formatPercentage(result.netMargin);
};

const handleCalculation = () => {
  const sanitizeAndParse = (input) => {
    const sanitized = sanitizeInput(input.value);
    input.value = sanitized;
    return parseValue(sanitized);
  };
  
  const productCost = sanitizeAndParse(productCostInput);
  const shippingCost = sanitizeAndParse(shippingCostInput);
  const marketingCost = sanitizeAndParse(marketingCostInput);
  const otherCosts = sanitizeAndParse(otherCostsInput);
  const platformFeeRate = sanitizeAndParse(platformFeeRateInput) / 100;
  const paymentFeeRate = sanitizeAndParse(paymentFeeRateInput) / 100;
  const otherFeeRate = sanitizeAndParse(otherFeeRateInput) / 100;
  const taxRate = sanitizeAndParse(taxRateInput) / 100;
  const profitMarginRate = sanitizeAndParse(profitMarginInput) / 100;
  const discountRate = sanitizeAndParse(discountRateInput) / 100;

  const result = calculate(
    productCost, shippingCost, marketingCost, otherCosts,
    platformFeeRate, paymentFeeRate, otherFeeRate, taxRate,
    profitMarginRate, discountRate
  );

  updateDisplay(result);
};

const setupEventListeners = () => {
  const inputs = document.querySelectorAll('.input-group input'); 
  inputs.forEach(input => {
    input.addEventListener('input', handleCalculation);
  });
};

const init = () => {
  setupEventListeners();
  handleCalculation();
};

document.addEventListener('DOMContentLoaded', init);
