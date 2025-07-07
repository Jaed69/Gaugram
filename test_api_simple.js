// Test API directo
async function testAPI() {
  try {
    // Test 1: Obtener todos los posts
    console.log('=== TEST: Obtener todos los posts ===');
    const allPostsResponse = await fetch('http://localhost:5000/api/posts');
    if (allPostsResponse.ok) {
      const allPosts = await allPostsResponse.json();
      console.log(`Total posts en feed: ${allPosts.length}`);
      allPosts.forEach((post, index) => {
        console.log(`${index + 1}. Usuario: ${post.userId?.username}, Content: ${post.content?.substring(0, 30)}...`);
      });
    } else {
      console.log('Error obteniendo todos los posts:', allPostsResponse.status);
    }

    console.log('\n=== TEST: Login ===');
    // Test 2: Login para obtener token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'usuario002', password: '123456' })
    });
    
    if (!loginResponse.ok) {
      console.log('Login fallido:', loginResponse.status);
      return;
    }
    
    const { token, user } = await loginResponse.json();
    console.log(`Login exitoso: ${user.username} (ID: ${user._id})`);
    console.log(`Posts count: ${user.postsCount}`);

    // Test 3: Obtener posts del usuario específico
    console.log('\n=== TEST: Obtener posts del usuario ===');
    const userPostsResponse = await fetch(`http://localhost:5000/api/posts/user/${user._id}`);
    if (userPostsResponse.ok) {
      const userPosts = await userPostsResponse.json();
      console.log(`Posts del usuario ${user.username}: ${userPosts.length}`);
      userPosts.forEach((post, index) => {
        console.log(`${index + 1}. Content: ${post.content?.substring(0, 50) || 'No content'}...`);
        console.log(`   Caption: ${post.caption?.substring(0, 50) || 'No caption'}...`);
        console.log(`   Imagen: ${post.imageUrl ? 'Sí' : 'No'}`);
      });
    } else {
      const errorText = await userPostsResponse.text();
      console.log('Error obteniendo posts del usuario:', userPostsResponse.status, errorText);
    }

  } catch (error) {
    console.error('Error en test:', error.message);
  }
}

// Simular fetch en Node.js
global.fetch = require('node-fetch');
testAPI();
