const fetch = require('node-fetch');

async function testProfile() {
  try {
    // Test 1: Verificar que el backend esté funcionando
    console.log('=== TESTING BACKEND HEALTH ===');
    const healthResponse = await fetch('http://localhost:5000/api/posts');
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const posts = await healthResponse.json();
      console.log('Total posts in system:', posts.length);
      
      // Test 2: Probar la ruta de posts por usuario
      if (posts.length > 0) {
        const firstPost = posts[0];
        const userId = firstPost.userId._id || firstPost.userId;
        
        console.log('\n=== TESTING USER POSTS ===');
        console.log('Testing with user ID:', userId);
        
        const userPostsResponse = await fetch(`http://localhost:5000/api/posts/user/${userId}`);
        console.log('User posts status:', userPostsResponse.status);
        
        if (userPostsResponse.ok) {
          const userPosts = await userPostsResponse.json();
          console.log('User posts found:', userPosts.length);
          console.log('User posts data:', userPosts.map(p => ({
            id: p._id,
            content: p.content?.substring(0, 50) || 'No content',
            caption: p.caption?.substring(0, 50) || 'No caption',
            hasImage: !!p.imageUrl,
            createdAt: p.createdAt
          })));
        } else {
          console.error('User posts error:', await userPostsResponse.text());
        }
      } else {
        console.log('No posts found in system');
      }
    } else {
      console.error('Backend health check failed:', await healthResponse.text());
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testProfile();
