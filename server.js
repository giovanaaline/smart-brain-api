const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//knex :: para conectar com o banco de dados
var knex = require('knex');
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

app.post("/signin", (req, res) => {
    bd.select('email', 'hash').from('login').where('email', '=', req.body.email)
    .then(resquery => {        
        if (resquery.length){
            const ehValido = bcrypt.compareSync(req.body.password, resquery[0].hash);
            if (ehValido){
                bd.select('*').from('users').where('email', '=', req.body.email)
                .then(r => res.json(r[0]))
                .catch(e => res.status(400).json('erro na obtenção dos dados do usuário'))                
            }else{
                res.status(400).json("erro de credencial");
            }
        }else{
            res.status(400).json("erro de credencial");
        }
    })
    .catch(err => res.status(400).json('erro técnico na validação'))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const new_password = bcrypt.hashSync(password, saltRounds);   
      bd.transaction(trx => {
        trx.insert({
          hash: new_password,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to register'))
  })

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    bd.select('*').from('users').where({id}) //geralmente ficaria 'id: id' em json, mas pode fazer direto pois tem o mesmo nome
    .then(resultado => {
        if (resultado.length){
            res.json(resultado[0])
        }
        else{
            res.status(400).json('id não encontrado!')
        }
    }).catch(error => res.status(400).json('erro ao buscar o id'));
})

app.put("/image/", (req, res) => {
    const { id } = req.body;
    bd('users')
        .where('id', '=', id)
        .increment('entries', 1) //tem o update, mas como vai somar, usou o increment
        .returning('entries')
        .then(resultado => {
            if (resultado.length){
                res.json(resultado[0]);
            }
            else{
                res.status(400).json('não realizado o update')
            }
        })
        .catch(error => res.status(400).json('erro ao incrementar a entrada desse usuário'))
})

app.listen(3000, () => {
    console.log("o aplicativo está rodando");
})