// Run this in browser console to clear all cart data
const keys = Object.keys(localStorage);
const cartKeys = keys.filter(key => key.includes('cart'));
cartKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`Removed: ${key}`);
});
console.log('All cart keys cleared from localStorage');
