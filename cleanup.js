// Script para limpiar localStorage y forzar re-login
console.log('=== CLEANUP SCRIPT ===');
console.log('Current localStorage user:', localStorage.getItem('user'));
console.log('Current localStorage token:', localStorage.getItem('token'));

// Limpiar localStorage
localStorage.removeItem('user');
localStorage.removeItem('token');

console.log('localStorage cleared. Please refresh the page and login again.');
alert('Se han limpiado los datos de sesión. Por favor, recarga la página e inicia sesión nuevamente.');
