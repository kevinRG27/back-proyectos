const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//crear servidor
const app = express();

//Conectar a la base de datos
conectarDB();

//Habilitar cors
app.use(cors());

//Habilitar express.JSON
app.use(express.json({extended: true}));

//puerto de la app
const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//arrancar la app
app.listen(PORT, () =>{
    console.log(`El servidor esta corriendo por el puerto ${PORT}`)
});