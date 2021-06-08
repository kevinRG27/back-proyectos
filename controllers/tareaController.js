const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req,res) => {
    
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    };

    
    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).send({msg:'No autorizado'})
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//obtiene las tareas por Proyecto
exports.obtenerTareas = async (req,res) => {

    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).send({msg:'No autorizado'})
        }

        //obtener tareas por proyecto
        const tareas = await Tarea.find({proyecto}).sort({creado : -1});
        res.json({tareas});

    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error')
    }
}

//actualizar una tarea
exports.actualizarTarea = async (req,res) =>{
    
    try {
        
        //Extraer el proyecto y comprobar si existe
        const {proyecto, nombre, estado} = req.body;

        //revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
 
        if(!tarea){
             return res.status(404).json({msg:'No existe esa tarea'})
        }
        
        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
 
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
           return res.status(401).json({msg:'No autorizado'})
        }

        //crear objeto con nueva info
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //guardar tarea
        tarea = await Tarea.findByIdAndUpdate({_id : req.params.id},nuevaTarea,{new: true});
        res.json({tarea});

    } catch (error) {
        console.log(error);
        return res.status(500).send({msg: 'Hubo un error'})
    }
}

//eliminar una tarea por id
exports.eliminarTarea = async (req, res) => {

    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;

        //revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
 
        if(!tarea){
             return res.status(404).json({msg:'No existe esa tarea'})
        }
        
        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
 
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
           return res.status(401).send({msg:'No autorizado'})
        }

        //Eliminar la tarea
        await Tarea.findOneAndRemove({_id : req.params.id});
        res.json({msg: 'Tarea eliminada'});

    } catch (error) {
        console.log(error);
        return res.status(404).send({msg: ' Tarea no encontrada'})
    }
}