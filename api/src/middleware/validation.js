const { body } = require('express-validator');

// Validaciones para registro
const validateRegister = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
    .matches(/^[a-zA-Z0-9._]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números, puntos y guiones bajos'),
  
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('fullName')
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre completo es requerido y debe tener máximo 100 caracteres')
    .trim()
];

// Validaciones para login
const validateLogin = [
  body('login')
    .notEmpty()
    .withMessage('Email o nombre de usuario requerido'),
  
  body('password')
    .notEmpty()
    .withMessage('Contraseña requerida')
];

// Validaciones para actualizar perfil
const validateUpdateProfile = [
  body('fullName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre completo debe tener máximo 100 caracteres')
    .trim(),
  
  body('bio')
    .optional()
    .isLength({ max: 150 })
    .withMessage('La biografía debe tener máximo 150 caracteres')
    .trim(),
  
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate debe ser un valor booleano')
];

// Validaciones para crear post
const validateCreatePost = [
  body('caption')
    .optional()
    .isLength({ max: 2200 })
    .withMessage('La descripción debe tener máximo 2200 caracteres')
    .trim(),
  
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('La ubicación debe tener máximo 100 caracteres')
    .trim()
];

// Validaciones para comentarios
const validateComment = [
  body('text')
    .notEmpty()
    .withMessage('El comentario no puede estar vacío')
    .isLength({ max: 500 })
    .withMessage('El comentario debe tener máximo 500 caracteres')
    .trim()
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateCreatePost,
  validateComment
};
