const jwt =require('jsonwebtoken');



const validarJWT = (req, res, next) => {
    //leer el token
    const token = req.header('x-token');
    console.log(token);
    if (!token) {

        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })

    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid=uid;
        console.log('Token válido. UID:', uid);
        next();
        
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }



   
}


module.exports = {
    validarJWT
}