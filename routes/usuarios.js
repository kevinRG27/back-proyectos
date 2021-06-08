//Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const {check} = require('express-validator');

//crea un usuarios
//api/usuarios
router.post('/',
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('email','El email es invalido').isEmail(),
        check('password','La contraseña debe tener al menos 6 caracteres').isLength({min:6})
    ],
    usuarioController.crearUsuario
);
module.exports = router;