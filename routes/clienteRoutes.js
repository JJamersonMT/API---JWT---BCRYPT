const router = require('express').Router();
const { ObjectId } = require('bson');
const Vendido = require('../models/Vendido');
const Produto = require('../models/Produto');
const verifyToken = require('../helpers/verifyToken')


// rota que busca todos os servicos do cliente filtrando pelo seu id
router.get('/:id',verifyToken,async function(req,res){

    if(req.params.id!=req.clienteId){
        return res.status(400).json({ auth: false, message: 'opaaaaaaaa !!' });
    }
    const id = new ObjectId(req.params.id)
    try {
        const produto = await Produto.find({clienteId:id})
        if(produto.length <=0){
            return res.status(404).json({error:'nao existe produtos '})
        }
        res.status(200).json({error:null,msg:'sucesso',data:produto})
    } catch (error) {
        return res.status(400).json({error})
    }

})

// rota que adiciona produto do cliente

router.post('/a',verifyToken,async function(req,res){ // *** otimizar para adicionar mais de um servico de uma so vez
    try {
        const resp = req.body.produtos.map(produto=> // percoroo o arrray para poder adicionar o idcliente nos produtos
            {
                produto.clienteId = new ObjectId(req.clienteId)//adicionando id do cliente ao produto
                return produto;
            })
        console.log(resp)
       try {
            resp.map(async produto =>{
                const p = await Vendido.findOneAndUpdate({name:produto.name,price:produto.price},{$inc:{qty:produto.qty}})
                try {
                    if(!p){
                        const vendido = new Vendido(produto)
                        const pro = await vendido.save()
                        console.log(`produto inserido ${pro}`)

                    }
                } catch (error) {
                    res.json({msg:'erro errado'})
                }
                 // insiro todos os produtos
                console.log(p)
                const dec = await Produto.findOneAndUpdate({name:produto.name,price:produto.price},{$inc:{qty:-produto.qty}})
            })
            res.json({msg:'sucess'})
       } catch (error) {
        return res.status(400).json({msg:'erro ao atualizar'})
       }

    } catch (error) {
        return res.status(400).json({error})
    }
})

module.exports = router

//rota adicao e atualizao na hora da compra feita
//rota de busca feita

//acredito que esteja tudo certo!!!!