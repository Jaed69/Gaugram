// mongo-init/init-mongo.js
// Script de inicialización de MongoDB para Gaugram

db = db.getSiblingDB('gaugram');

// Crear colecciones con validación de esquemas
db.createCollection('users', {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["username", "email", "password"],
         properties: {
            username: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            email: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            password: {
               bsonType: "string",
               description: "must be a string and is required"
            }
         }
      }
   }
});

db.createCollection('posts');
db.createCollection('comments');
db.createCollection('notifications');

// Crear índices para optimizar consultas
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });

db.posts.createIndex({ "userId": 1 });
db.posts.createIndex({ "createdAt": -1 });
db.posts.createIndex({ "hashtags": 1 });

db.comments.createIndex({ "postId": 1 });
db.comments.createIndex({ "userId": 1 });
db.comments.createIndex({ "createdAt": -1 });

db.notifications.createIndex({ "recipientId": 1, "createdAt": -1 });
db.notifications.createIndex({ "isRead": 1 });

print('MongoDB initialized successfully for Gaugram');
