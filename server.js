const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//knex :: para conectar com o banco de dados
var knex = require('knex');

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
    res.send(database.users);
})

app.post('/register', (req, res) => {register.handleRegister(req, res, bd, bcrypt, saltRounds)})
app.post("/signin", (req, res) => {signin.handleSignin(req, res, bd, bcrypt)})
app.get("/profile/:id", (req, res) => {profile.handleProfile(req, res, bd)})
app.put("/image/", (req, res) => {image.handleImage(req, res, bd)})

app.listen(3000, () => {
    console.log("o aplicativo está rodando");
})