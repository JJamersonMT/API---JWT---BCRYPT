const router = require('express').Router();
const { ObjectId } = require('bson');
const Cliente = require('../models/cliente');
const Service = require('../models/service');


// rota que busca todos os servicos do cliente filtrando pelo seu id
router.get('/:id',async function(req,res){

    const id = new ObjectId(req.params.id)
    try {
        const service = await Service.find({clienteId:id})
        if(service.length <=0){
            return res.status(400).json({error:'nao existe servicos'})
        }
        res.status(200).json({error:null,msg:'sucesso',data:service})
    } catch (error) {
        return res.status(400).json({error})
    }

})

// rota que adiciona servicos do cliente
router.post('/service',async function(req,res){ // *** otimizar para adicionar mais de um servico de uma so vez

    const resp = req.body
    resp.clienteId = new ObjectId(resp.clienteId)
    try {

        const service = new Service(resp)

        try {

			const newService = await service.save()
			res.json({error:null,msg:'servico adicionado com sucesso!',data:newService})

		} catch (error) {
			return res.status(400).json({error:'servico nao adicionado'})
		}

    } catch (error) {
        return res.status(400).json({error})
    }



})

module.exports = router