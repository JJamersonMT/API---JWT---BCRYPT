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
        console.log(secret)
        console.log(token)
        jwt.verify(token,secret)

        next()
    } catch (error) {
        res.status(400).json({msg:'token invalido'})
    }
}

module.exports = verifyToken;