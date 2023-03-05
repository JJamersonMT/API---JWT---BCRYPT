const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const vendidoSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        require:true
    },
    clienteId:{
        type:ObjectId,
        required:true
    },
    qty:{
        type:Number,
        required:true
    }
});

const vendido = mongoose.model('vendido',vendidoSchema)

module.exports = vendido