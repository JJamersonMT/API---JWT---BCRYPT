const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        require:true
    },
    comprado:{
        type:Boolean,
        require:false
    },
});

const produto = mongoose.model('produto',produtoSchema)

module.exports = produto