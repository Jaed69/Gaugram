# Gaugram - Diseño de Base de Datos

## 📊 Esquema de Base de Datos para Red Social (Instagram-like)

### **1. Colección: Users**
```javascript
{
  _id: ObjectId,
  username: String,           // Único, requerido
  email: String,              // Único, requerido
  password: String,           // Hash, requerido
  fullName: String,
  bio: String,
  profileImage: String,       // URL de la imagen de perfil
  isVerified: Boolean,        // Cuenta verificada
  isPrivate: Boolean,         // Perfil privado
  followers: [ObjectId],      // Referencias a Users
  following: [ObjectId],      // Referencias a Users
  postsCount: Number,
  followersCount: Number,
  followingCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### **2. Colección: Posts**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Referencia a Users
  imageUrl: String,           // URL de la imagen principal
  caption: String,            // Descripción del post
  hashtags: [String],         // Array de hashtags
  location: String,           // Ubicación opcional
  likes: [ObjectId],          // Referencias a Users que dieron like
  likesCount: Number,
  commentsCount: Number,
  isActive: Boolean,          // Para soft delete
  createdAt: Date,
  updatedAt: Date
}
```

### **3. Colección: Comments**
```javascript
{
  _id: ObjectId,
  postId: ObjectId,           // Referencia a Posts
  userId: ObjectId,           // Referencia a Users
  text: String,               // Contenido del comentario
  likes: [ObjectId],          // Referencias a Users que dieron like
  likesCount: Number,
  parentComment: ObjectId,    // Para respuestas a comentarios
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **4. Colección: Stories** (Opcional - Funcionalidad avanzada)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Referencia a Users
  imageUrl: String,
  text: String,               // Texto overlay opcional
  viewers: [ObjectId],        // Referencias a Users que vieron
  viewsCount: Number,
  expiresAt: Date,            // 24 horas después de creación
  isActive: Boolean,
  createdAt: Date
}
```

### **5. Colección: Notifications**
```javascript
{
  _id: ObjectId,
  recipientId: ObjectId,      // Usuario que recibe la notificación
  senderId: ObjectId,         // Usuario que genera la notificación
  type: String,               // 'like', 'comment', 'follow', 'mention'
  postId: ObjectId,           // Referencia opcional a Posts
  commentId: ObjectId,        // Referencia opcional a Comments
  message: String,
  isRead: Boolean,
  createdAt: Date
}
```

## 🔗 **Relaciones entre Colecciones**

### **Users ↔ Posts** 
- Un usuario puede tener muchos posts (1:N)
- Un post pertenece a un usuario (N:1)

### **Posts ↔ Comments**
- Un post puede tener muchos comentarios (1:N)
- Un comentario pertenece a un post (N:1)

### **Users ↔ Comments**
- Un usuario puede hacer muchos comentarios (1:N)
- Un comentario pertenece a un usuario (N:1)

### **Users ↔ Users (Follows)**
- Relación muchos a muchos (M:N)
- Un usuario puede seguir a muchos usuarios
- Un usuario puede ser seguido por muchos usuarios

### **Users ↔ Posts (Likes)**
- Relación muchos a muchos (M:N)
- Un usuario puede dar like a muchos posts
- Un post puede recibir likes de muchos usuarios

## 📚 **Índices Recomendados**

```javascript
// Users
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })

// Posts
db.posts.createIndex({ "userId": 1 })
db.posts.createIndex({ "createdAt": -1 })
db.posts.createIndex({ "hashtags": 1 })

// Comments
db.comments.createIndex({ "postId": 1 })
db.comments.createIndex({ "userId": 1 })
db.comments.createIndex({ "createdAt": -1 })

// Notifications
db.notifications.createIndex({ "recipientId": 1, "createdAt": -1 })
db.notifications.createIndex({ "isRead": 1 })
```

## 🚀 **Consideraciones de Rendimiento**

1. **Desnormalización controlada**: Guardar contadores (likesCount, commentsCount) para evitar queries costosas
2. **Paginación**: Implementar cursor-based pagination para feeds largos
3. **Caché**: Usar Redis para datos frecuentemente accedidos (feed del usuario, trending hashtags)
4. **Imágenes**: Usar CDN para almacenamiento y entrega de imágenes
5. **Agregaciones**: Usar MongoDB aggregation pipeline para queries complejas del feed
