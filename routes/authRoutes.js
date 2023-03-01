const router = require('express').Router();
const Cliente = require('../models/cliente');
const verifyToken = require('../helpers/verifyToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config()



// rota que registra clientes
router.post('/register',async function(req,res){

    const {name , email ,password , confirmPassword} = req.body

    //validacoes
    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({error:'preencha todos os campos!'})
    }

    //valida se as senhas conferem
    if(password != confirmPassword){
        return res.status(400).json({error:'as senhas nao conferem!'})
    }

    //valida se ja existe uma conta de email cadastrada
    const cliente = await Cliente.findOne({email:email})
    if(cliente){
        res.status(400).json({msg:'usuario ja existe!'})
    }

    //criacao dos saltos para criptografia das senhas
    const salt = await bcrypt.genSalt(12);//geracao de salto
    const passwordHash = await bcrypt.hash(password,salt);// criamos um hash passando senha e saltos

    //criacao de cliente
    try {
        const cliente = new Cliente({
            name,
            email,
            password:passwordHash
        })

        try {
            const newCliente = await cliente.save()
            res.status(200).json({error:null,msg:'cliente adicionado'})
        } catch (error) {
            return res.status(400).json({error:'cliente nao adicionado'})
        }

    } catch (error) {
        return res.status(400).json({error})
    }

})

router.post('/login',async function(req,res){

    const {email,password} = req.body

    //validacoes
    if(!email || !password ){
        res.status(400).json({msg:'preencha todos os campos!'})
    }

    try {

    //valida se ja existe uma conta de email cadastrada
    const cliente = await Cliente.findOne({email:email})

    if(!cliente){
        res.status(404).json({msg:'cliente nao existe!'})
    }

    //valida se a senha confere com o banco
    const checkPassword = await bcrypt.compare(password,cliente.password)

    if(!checkPassword){
        return res.status(404).json({msg:"senha invalida!"})
    }

    try {
        //
        const secret = process.env.SECRET
        console.log(secret)
        const token = jwt.sign(
            {
                id : cliente._id,
            },
            secret,
        )

        res.status(200).json({msg:"autenticacao realizada com sucesso",token,cliente})

    } catch (error) {
        res.status(400).json({error:"aqui"})
    }

    } catch (error) {
        res.status(400).json({error})
    }
})

router.get('/cliente/:id',verifyToken,async function(req,res){

    const id = req.params.id;

    // verifica se cliente existe

    const cliente = await Cliente.findById(id,'-password')

    if(!cliente){
        res.status(404).json({msg:"usuario nao encontrado"})
    }
    res.status(200).json({cliente})

})


module.exports = router