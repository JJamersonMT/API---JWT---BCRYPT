const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
});

const Cliente = mongoose.model('cliente',clienteSchema)

module.exports = Cliente