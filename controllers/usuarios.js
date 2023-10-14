const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find();

    res.json({
        ok: true,
        usuarios: usuarios
    });

}

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;


    try {


        const existeEmail = await Usuario.findOne({ email:email });
        if (existeEmail) {

            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }


        const usuario = new Usuario(req.body);
        //encriptar contraseña 
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);
        
        //Guardar usuario
        await usuario.save();
        //Generar un token JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario: usuario,
            token:token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado....revisar logs'
        });
    }
}

const actualizarUsuario = async (req, res = response) => {


    //VALIDAR TOKEN Y COMPROBAR SI EL USUARIO ES CORRECTO

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe por ese ID'
            })
        }

        const { password, google, ...campos } = req.body;
        if (usuarioDB.email === req.body.email) {
            delete campos.email;
        } else {
            const existeEmail = await Usuario.findOne({ email: req.body.email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado....revisar logs'
        })

    }
}

const eliminarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe por ese ID'
            })
        }
        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok: true,
            uid: "Usuario Eliminado"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado....revisar logs'
        })
    }



}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}