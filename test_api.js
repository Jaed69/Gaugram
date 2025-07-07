// Script para probar las APIs de Gaugram
const fetch = require('node-fetch');

// Configuración base
const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Función para hacer login y obtener token
async function login() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'usuario001',
        password: '123456'
      })
    });

    if (response.ok) {
      const data = await response.json();
      authToken = data.token;
      console.log('✅ Login exitoso');
      return true;
    } else {
      console.log('❌ Login falló:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Error en login:', error.message);
    return false;
  }
}

// Función para probar el perfil
async function testProfile() {
  try {
    const response = await fetch(`${BASE_URL}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Perfil obtenido:', data.username);
      return data;
    } else {
      console.log('❌ Error obteniendo perfil:', response.status);
      return null;
    }
  } catch (error) {
    console.log('❌ Error en perfil:', error.message);
    return null;
  }
}

// Función para probar posts del usuario
async function testUserPosts(userId) {
  try {
    const response = await fetch(`${BASE_URL}/api/posts/user/${userId}`);

    if (response.ok) {
      const posts = await response.json();
      console.log('✅ Posts obtenidos:', posts.length);
      return posts;
    } else {
      console.log('❌ Error obteniendo posts:', response.status);
      return [];
    }
  } catch (error) {
    console.log('❌ Error en posts:', error.message);
    return [];
  }
}

// Ejecutar pruebas
async function runTests() {
  console.log('🧪 Iniciando pruebas de API...');
  
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ No se pudo continuar sin login');
    return;
  }

  const profile = await testProfile();
  if (profile) {
    await testUserPosts(profile._id);
  }

  console.log('🏁 Pruebas completadas');
}

runTests().catch(console.error);
