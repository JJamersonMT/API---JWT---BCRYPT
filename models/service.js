const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    clienteId:{
        type:ObjectId,
        required:true
    },
});

const Service = mongoose.model('service',serviceSchema)

module.exports = Service