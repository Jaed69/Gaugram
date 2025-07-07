// Test script para crear posts de texto
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testTextPost() {
  try {
    // Primero hacer login
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'usuario001',
        password: '123456'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      return;
    }

    const { token } = await loginResponse.json();
    console.log('✅ Login successful');

    // Crear post de solo texto
    const postResponse = await fetch(`${BASE_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content: 'Este es un post de solo texto para probar la funcionalidad',
        caption: 'Caption del post de texto',
        location: 'Lima, Perú'
      })
    });

    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log('✅ Post de texto creado exitosamente:', postData.post._id);
    } else {
      const errorData = await postResponse.json();
      console.log('❌ Error creando post:', postResponse.status, errorData);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testTextPost();
