#!/usr/bin/env node

const http = require('http');

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: res.statusCode === 200 ? JSON.parse(data) : data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function testBackend() {
  console.log('=== TESTING BACKEND ===');
  
  try {
    // Test health check
    console.log('Testing /api/posts endpoint...');
    const postsResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/posts',
      method: 'GET'
    });
    
    console.log('Posts endpoint status:', postsResponse.status);
    
    if (postsResponse.status === 200) {
      console.log('Posts found:', postsResponse.data.length);
      
      if (postsResponse.data.length > 0) {
        const firstPost = postsResponse.data[0];
        const userId = firstPost.userId._id || firstPost.userId;
        console.log('Testing user posts for user:', userId);
        
        const userPostsResponse = await makeRequest({
          hostname: 'localhost',
          port: 5000,
          path: `/api/posts/user/${userId}`,
          method: 'GET'
        });
        
        console.log('User posts status:', userPostsResponse.status);
        console.log('User posts count:', userPostsResponse.data.length);
      }
    } else {
      console.log('Backend error:', postsResponse.data);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testBackend();
