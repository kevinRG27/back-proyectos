const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //validar si el check encuentra errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    };
    //extraer email y password
    const { email, password } = req.body;
   
    try {
        //validar si ya existe un usuario con ese correo
        
        let usuario = await Usuario.findOne({email});
        
        if(usuario){
            return res.status(400).json({msg: 'Ya existe una cuenta asociada a este correo'});
        }

        //crea nuevo usuario
        usuario = new Usuario(req.body);

        //hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password,salt);

        //guarda usuario creado
        await usuario.save();

        //crear y firmar el jwt
        const payload = {
            usuario : {
                id : usuario.id
            }
        };

        //firmar el JWT
        jwt.sign(payload,process.env.SECRETA,{
            expiresIn: 3600 //1 hora para expirar el token
        },(error,token) => {
            if(error) throw error;

            //mensaje de confirmacion
            res.json({token});
        });
        

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}