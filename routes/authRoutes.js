const router = require('express').Router();//metodo router de dentro do modulo express
const Cliente = require('../models/Cliente');// model de cliente
const verifyToken = require('../helpers/verifyToken');//middleware de verificacao do token
const bcrypt = require('bcrypt');//modulo ou biblioteca para criptografia de senhas para adicionar ao banco de dados
const jwt = require('jsonwebtoken');//biblioteca que nos permite criar token para trabalhar com autorizacoes do usuario
require('dotenv').config()//importamos o arquivo .env onde estao nossas variaveis de ambiente



// rota que registra clientes
router.post('/register',async function(req,res){

    const {name , email ,password , confirmPassword} = req.body//recebemos os dados passados pelo metodo post na requisicao vinda do frontend

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
            const newCliente = await cliente.save()//salvamos os dados do cliente no banco
            res.status(200).json({error:null,msg:'cliente adicionado'})//
        } catch (error) {
            return res.status(400).json({error:'cliente nao adicionado'})
        }

    } catch (error) {
        return res.status(400).json({error})
    }

})

//rota de autenticacao , onde validamos o login do cliente e geramos seu token para permanencia na aplicacao
router.post('/login',async function(req,res){

    const {email,password} = req.body//recebemos os dados da requisicao

    //validacoes
    if(!email || !password ){
        res.status(400).json({msg:'preencha todos os campos!'})
    }

    try {

    //valida se ja existe uma conta de email cadastrada
    const cliente = await Cliente.findOne({email:email})

    if(!cliente){//se o email passado nao existe nao continuamos e a tentativa de login ja e invalida
        res.status(404).json({msg:'cliente nao existe!'})
    }

    //valida se a senha confere com o banco
    const checkPassword = await bcrypt.compare(password,cliente.password)//guardamos em uma constante o resultado da comparacao entre a senha pura e a senha que vem do banco criptografada

    if(!checkPassword){//aqui retornamos erro de login se a comparacao nao deu certo
        return res.status(404).json({msg:"senha invalida!"})
    }

    try {
        //
        const secret = process.env.SECRET//recebemos os dados que estao em nosso arquivo .env
        //aqui geramos um token pois o usuario passou por todas as validacoes
        const token = jwt.sign(
            {//aqui passamos alguns dados {payload}
                id : cliente._id,//id do cliente
            },
            secret,//aqui passamos nossa secret
        )

        res.status(200).json({msg:"autenticacao realizada com sucesso",token,cliente})//retornamos o token para o cliente

    } catch (error) {
        res.status(400).json({error:"aqui"})
    }

    } catch (error) {
        res.status(400).json({error})
    }
})



module.exports = router