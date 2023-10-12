require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config')

//crear el servidor de express
const app =express();
//cofigurar cors
app.use(cors())
//Base de datos
dbConnection();

//mean_user
//GlkCFkXp9OqFiJ4V
//ruta
app.get('/',(req,res)=>{

    res.json({
        ok:true,
        msg: 'Hola mundo'
    })

})

app.listen(process.env.PORT,()=>{
    console.log('Servidor Corriendo en puerto '+process.env.PORT)
})

