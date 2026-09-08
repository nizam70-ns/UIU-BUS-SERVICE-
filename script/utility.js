
//utility.js
// Dynamic seat background styling
function setBackgroundColorById(id) {
  const el = document.getElementById(id);
  if (el) el.style.backgroundColor = 'green';
}

function setSeatSelectedStyle(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
    el.classList.add('bg-lime-500', 'text-white');
  }
}

// Text updates helper
function setInnerText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.innerText = value;
  }
}

// Calculate sum total
function totalCost(id, value) {
  const totalPriceElement = document.getElementById(id);
  const totalPrice = totalPriceElement.innerText;
  const convertedTotalPrice = parseInt(totalPrice) || 0;
  const sumTotalPrice = convertedTotalPrice + value;
  setInnerText(id, sumTotalPrice);
}

// Calculate Grand Total
function grandTotalCost() {
  const totalPriceElement = document.getElementById('total-cost');
  const totalPrice = totalPriceElement.innerText;
  let convertedTotalPrice = parseInt(totalPrice) || 0;
  setInnerText('grand-total', convertedTotalPrice);
}

// Coupon discount calculation
function coupon() {
  const totalPriceElement = document.getElementById('total-cost');
  let convertedTotalPrice = parseInt(totalPriceElement.innerText) || 0;
  const input = document.getElementById('coupon-value');
  const inputValue = input.value.trim();

  if (inputValue === 'Couple 20') {
    const discount = (convertedTotalPrice * 20) / 100;
    convertedTotalPrice = convertedTotalPrice - discount;
    setInnerText('grand-total', convertedTotalPrice);
    document.getElementById('coupon-input').classList.add('hidden');
  } else if (inputValue === 'NEW15') {
    const discount = (convertedTotalPrice * 15) / 100;
    convertedTotalPrice = convertedTotalPrice - discount;
    setInnerText('grand-total', convertedTotalPrice);
    document.getElementById('coupon-input').classList.add('hidden');
  } else {
    alert('Invalid Coupon Code');
  }
}

