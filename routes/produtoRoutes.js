const router = require('express').Router();
const { ObjectId } = require('bson');
const Produto = require('../models/Produto');
const Vendido = require('../models/Vendido');
const verifyToken = require('../helpers/verifyToken')

//ROTA DE BUSCA DOS PRODUTOS EM ESTOQUE
router.get('/',verifyToken,async function(req,res){ // *** otimizar para adicionar mais de um servico de uma so vez
    try {
        const produtos = await Produto.find({})
        res.json({msg:'sucesso',produtos})

    } catch (error) {
        return res.status(400).json({error})
    }
})

//ROTA PARA ADICIONAR PRODUTOS
router.post('/a',verifyToken,async function(req,res){ // *** otimizar para adicionar mais de um servico de uma so vez
    try {
        const resp = req.body.produtos.map(produto=> // percoroo o arrray para poder adicionar o idcliente nos produtos
            {
                produto.clienteId = new ObjectId(req.clienteId)//adicionando id do cliente ao produto
                return produto;
            })

            resp.map(async produto=>{
                let id = new ObjectId(produto.id)
                console.log(id)
                const prod = await Produto.findOneAndUpdate({name:produto.name,price:produto.price},{$inc:{qty:produto.qty}}) // insiro todos os produtos
                try {
                    if(!prod){
                        const prod = new Produto(produto)
                        const pro = await prod.save()
                        console.log(`produto inserido ${pro}`)
                        
                    }else{

                    }
                } catch (error) {
                    res.json({msg:'erro errado'})
                }
                 // insiro todos os produtos
                console.log(prod)
            })

            res.status(200).json({msg:"sucesso"})




    } catch (error) {
        return res.status(400).json({error,msg:'errorororor'})
    }
})

//rota de remocao de produto
router.delete('/d/:id',verifyToken,async function(req,res){ // *** otimizar para adicionar mais de um servico de uma so vez
    try { //

        const produtoId = req.params.id; // pego o id do produto
        const clienteProdutoId = await Produto.findOne({_id:produtoId}) // vejo se ha o produto

        if(req.clienteId != clienteProdutoId.clienteId){ // validacao se o id do produto he o mesmo do id do cliente nao permitindo deletar produtos de outros usuarios
            return res.status(500).json({msg:'voce esta acessando um produto que nao e seu'})
        }

        try {//AQUI OCORRE A REMOCAO
            const delProduto = await Produto.deleteOne({_id:produtoId})//removo um produto
            res.status(200).json({msg:"produto deletado com sucesso!",delProduto})//retorno sucesso e produto deletado
        } catch (error) {
            return res.status(500).json({msg:'ocorreu algum erro ao tentar deletar tente novamente'})
        }

    } catch (error) {
        return res.status(400).json({msg:'erro ao buscar produto verifique novamente '})
    }

})

//rota de atualizacao de produto
router.put('/u/:id',verifyToken,async function(req,res){ // *** otimizar para adicionar mais de um servico de uma so vez
    try { //

        const updateProduto = {
            name:req.body.name,
            price:req.body.price
        }
        const produtoId = req.params.id; // pego o id do produto
        const clienteProdutoId = await Produto.findOne({_id:produtoId}) // vejo se ha o produto

        if(req.clienteId != clienteProdutoId.clienteId){ // validacao se o id do produto he o mesmo do id do cliente nao permitindo deletar produtos de outros usuarios
            return res.status(500).json({msg:'voce esta acessando um produto que nao e seu'})
        }

        try {//AQUI OCORRE A ATUALIZACAO
            const upProduto = await Produto.updateOne({_id:produtoId},{$set:updateProduto},{new:true})//atualiza um produto
            res.status(200).json({msg:"produto atualizado com sucesso!",upProduto})//retorno sucesso e produto deletado
        } catch (error) {
            return res.status(500).json({msg:'ocorreu algum erro ao tentar atualizar tente novamente'})
        }

    } catch (error) {
        return res.status(400).json({msg:'erro ao buscar produto verifique novamente '})
    }

})


module.exports = router