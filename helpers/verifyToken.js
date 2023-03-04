require('dotenv').config()
const jwt = require('jsonwebtoken');
async function verifyToken(req,res,next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        res.status(401).json({msg:"acesso negado!"})
    }

    try {

        const secret = process.env.SECRET
        jwt.verify(token, secret, function(err, decoded) {
            //aqui esta a validacao da existencia de um token valido
            if (err)
                return res.status(500).json({ auth: false, message: 'Token inválido.' });

            req.clienteId = decoded.id
            next();
        });

    } catch (error) {
        res.status(400).json({msg:'token invalido'})
    }
}

module.exports = verifyToken;