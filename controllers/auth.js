const { response } = require('express');
const Usuario = require('../models/usuarios');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const login = async (req, res = response) => {

    const { email, password } = req.body;
    try {
        //Verificar email
        const usuarioDB= await Usuario.findOne({  email })

        if (!usuarioDB) {

            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        //Verificar contraseña
        const validPassword = bcryptjs.compareSync(password,usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            })
        }

        //Generar un token JWT

        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok: true,
            token: token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado....revisar logs'
        });
    }


}



module.exports = {
    login
}