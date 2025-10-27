const productCost = document.getElementById('product-cost');
const shippingCost = document.getElementById('shipping-cost');
const marketingCost = document.getElementById('marketing-cost');
const otherCosts = document.getElementById('other-costs');
const platformFeeRate = document.getElementById('platform-fee-rate');
const paymentFeeRate = document.getElementById('payment-fee-rate');
const otherFeeRate = document.getElementById('other-fee-rate');
const taxRate = document.getElementById('tax-rate');
const profitMargin = document.getElementById('profit-margin');
const discountRate = document.getElementById('discount-rate');
const suggestedPriceDisplay = document.getElementById('suggested-price');
const discountedPriceDisplay = document.getElementById('discounted-price');
const netProfitDisplay = document.getElementById('net-profit');
const netMarginDisplay = document.getElementById('net-margin');
const resetButton = document.getElementById('reset');

const formatCurrency = (value) => `$ ${value.toFixed(2)}`;
const formatPercentage = (value) => `${value.toFixed(2)}%`;

const sanitizeInput = (rawValue) => {
  let value = rawValue.replace(/[^\d.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
  if (value.startsWith('-')) value = value.substring(1);
  return value;
};

const parseValue = (sanitizedValue) => {
  const numericValue = parseFloat(sanitizedValue);
  return (isNaN(numericValue) || numericValue < 0) ? 0 : numericValue;
};

const calculate = (pc, sc, mc, oc, pfr, pyfr, ofr, tr, pmr, dr) => {
  const totalCost = pc + sc + mc + oc;
  const totalFeeRate = pfr + pyfr + ofr + tr;
  const revenueFraction = 1 - totalFeeRate;
  if (revenueFraction <= 0) return { suggestedPrice: 0, discountedPrice: 0, netProfit: 0, netMargin: 0 };
  const desiredRevenue = totalCost * (1 + pmr);
  const suggestedPrice = desiredRevenue / revenueFraction;
  const discountedPrice = suggestedPrice * (1 - dr);
  const platformFee = discountedPrice * pfr;
  const paymentFee = discountedPrice * pyfr;
  const otherFee = discountedPrice * ofr;
  const tax = discountedPrice * tr;
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

const clearAll = () => {
  productCost.value = '';
  shippingCost.value = '';
  marketingCost.value = '';
  otherCosts.value = '';
  platformFeeRate.value = '';
  paymentFeeRate.value = '';
  otherFeeRate.value = '';
  taxRate.value = '';
  profitMargin.value = '';
  discountRate.value = '';
  handleCalculation();
};

const handleInput = (e) => {
  const input = e.target;
  input.value = sanitizeInput(input.value);
  handleCalculation();
};

const handleCalculation = () => {
  const sanitizeAndParse = (input) => parseValue(input.value);
  const pc = sanitizeAndParse(productCost);
  const sc = sanitizeAndParse(shippingCost);
  const mc = sanitizeAndParse(marketingCost);
  const oc = sanitizeAndParse(otherCosts);
  const pfr = sanitizeAndParse(platformFeeRate) / 100;
  const pyfr = sanitizeAndParse(paymentFeeRate) / 100;
  const ofr = sanitizeAndParse(otherFeeRate) / 100;
  const tr = sanitizeAndParse(taxRate) / 100;
  const pmr = sanitizeAndParse(profitMargin) / 100;
  const dr = sanitizeAndParse(discountRate) / 100;
  const result = calculate(pc, sc, mc, oc, pfr, pyfr, ofr, tr, pmr, dr);
  updateDisplay(result);
};

const setupEventListeners = () => {
  const inputs = document.querySelectorAll('.input-group input');
  inputs.forEach(input => { input.addEventListener('input', handleInput) });
  resetButton.addEventListener('click', clearAll);
};

const init = () => {
  setupEventListeners();
  handleCalculation();
};

document.addEventListener('DOMContentLoaded', init);
