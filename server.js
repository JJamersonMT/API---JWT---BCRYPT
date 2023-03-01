//importacao dos modulos
const express = require('express');
const mongoose = require('mongoose');
const app = express();
// const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()


//config
const dbName = 'agenda';
const port = 3000;

mongoose.set('strictQuery', false)
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

//importacao das rotas
const authRouter = require('./routes/authRoutes.js');

//atrellar as rotas no express
app.use('/api/auth',authRouter)

//conexao DB
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`,
	{
		useNewUrlParser:true,
		useUnifiedTopology:true
	})
.then(()=>{app.listen(port,()=>{console.log(`a conexao foi estabelecida`),console.log(`o backend esta rodando na porta ${port }`),console.log(`o servidor esta ativo`)})})
.catch(()=>{
	console.log('ocorreu algum erro com a conexao ao banco de dados')
})

