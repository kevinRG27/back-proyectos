//Rutas para crear, editar y eliminar tareas
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

// Crea tareas
// api/tareas
router.post('/',
    auth,
    [
        check('nombre','El nombre  es obligatorio').not().isEmpty(),
        check('proyecto','El Proyecto  es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

//obtener las tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//actualizar tarea via ID
router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

//eliminar proyecto
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)
module.exports = router;