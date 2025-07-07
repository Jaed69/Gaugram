// Crear usuario y post de prueba
const fetch = require('node-fetch');

async function createTestUserAndPost() {
  try {
    console.log('=== Creando usuario de prueba ===');
    
    // Crear usuario
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser03',
        email: 'test03@example.com',
        password: '123456',
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User 03'
      })
    });

    if (!registerResponse.ok) {
      console.log('Usuario ya existe o error en registro');
      // Intentar login
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser03', password: '123456' })
      });
      
      if (!loginResponse.ok) {
        console.log('Error en login:', loginResponse.status);
        return;
      }
      
      const { token, user } = await loginResponse.json();
      console.log(`Login exitoso: ${user.username}`);
      
      // Crear post
      await createPost(token, user);
      
    } else {
      const { token, user } = await registerResponse.json();
      console.log(`Usuario creado: ${user.username}`);
      
      // Crear post
      await createPost(token, user);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function createPost(token, user) {
  console.log('\n=== Creando post de prueba ===');
  
  const postResponse = await fetch('http://localhost:5000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      content: 'Este es un post de prueba para verificar que funciona correctamente',
      caption: 'Post de prueba',
      location: 'Test Location'
    })
  });

  if (postResponse.ok) {
    const postData = await postResponse.json();
    console.log(`Post creado exitosamente: ${postData.post._id}`);
    
    // Verificar posts del usuario
    console.log('\n=== Verificando posts del usuario ===');
    const userPostsResponse = await fetch(`http://localhost:5000/api/posts/user/${user._id}`);
    if (userPostsResponse.ok) {
      const posts = await userPostsResponse.json();
      console.log(`Posts encontrados: ${posts.length}`);
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.content?.substring(0, 50)}...`);
      });
    } else {
      console.log('Error obteniendo posts:', userPostsResponse.status);
    }
    
  } else {
    const errorData = await postResponse.json();
    console.log('Error creando post:', errorData);
  }
}

createTestUserAndPost();
