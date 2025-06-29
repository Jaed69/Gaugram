// api/healthcheck.js
const mongoose = require('mongoose');

const healthCheck = async () => {
  try {
    // Verificar que la aplicación esté respondiendo
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    
    console.log('Health check passed');
    process.exit(0);
  } catch (error) {
    console.error('Health check failed:', error.message);
    process.exit(1);
  }
};

healthCheck();
