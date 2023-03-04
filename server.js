//importacao dos modulos
const express = require('express');
const mongoose = require('mongoose');
const app = express();
// const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()


//config
const dbName = 'agenda';//nome do banco de dados
const port = 3000;//porta da aplicacao

mongoose.set('strictQuery', false)
app.use(cors());//utilizacao do cors na aplicacao
app.use(express.json());//utilizacao que define que receberemos dados em notacao json nas requisicoes
app.use(express.static('public'))//usamos a pasta public da aplicacao para fornecer arquivos staticos

//importacao das rotas
const authRouter = require('./routes/authRoutes.js');//rota de autenticacao
const clienteRouter = require('./routes/clienteRoutes.js');//rota das acoes do cliente ao serem autenticados
const produtoRouter = require('./routes/produtoRoutes.js');//rota de CRUD de produtos

//atrellar as rotas no express
app.use('/api/auth',authRouter)//usando a rota /api/auth e definindo a ela uma rota de tratamento
app.use('/api/cliente',clienteRouter)//usamos a /api/cliente e definimos uma rota pra tratar sua continuacao
app.use('/api/produto',produtoRouter)//usando a rota /api/produto e definindo a ela uma rota CRUD para painel de administrador
//conexao DB
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`,//conectamos a api no banco de dados pela ORM mongoose
	{
		useNewUrlParser:true,//---------
		useUnifiedTopology:true//---------
	})
.then(()=>{app.listen(port,()=>{console.log(`a conexao foi estabelecida`),console.log(`o backend esta rodando na porta ${port }`),console.log(`o servidor esta ativo`)})})//a conexao foi realizada e passamos esta informacao pelo console
.catch(()=>{
	console.log('ocorreu algum erro com a conexao ao banco de dados')//ocorreu algum erro na conexao com o banco de dados
})

