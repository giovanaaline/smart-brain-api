const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//knex :: para conectar com o banco de dados
var knex = require('knex');

//email-validator:: instalado por conta para validar o e-mail
var emailValidator = require('email-validator');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const bd = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '123456',
      database : 'smart-brain'
    }
  });

// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(bodyParser.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send('está funcionando');
})

app.post('/register', (req, res) => {register.handleRegister(req, res, bd, bcrypt, saltRounds, emailValidator)})
app.post("/signin", (req, res) => {signin.handleSignin(req, res, bd, bcrypt, emailValidator)})
app.get("/profile/:id", (req, res) => {profile.handleProfile(req, res, bd)})
app.put("/image/", (req, res) => {image.handleImage(req, res, bd)})
app.post("/imageurl/", (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`o aplicativo está rodando na porta ${process.env.PORT}`);
})