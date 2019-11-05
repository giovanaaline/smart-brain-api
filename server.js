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

const database = {
    users: [
        {
        id: '123',
        name: 'Giovana',
        email: 'giovana@gmail.com',
        // batata
        password: '$2b$10$HGl0i51cDd1r7TJYBmqLCOHgInFj80ikDCJpdWqqfjSA/sNSMGGrO',
        entries: 0,
        joined: new Date()
        },
        {
            id: '124',
            name: 'Maria',
            email: 'maria@gmail.com',
            passorwd: 'cafe',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get("/", (req, res) => {
    res.send(database.users);
})

app.post("/signin", (req, res) => {
   
   if (req.body.email === database.users[0].email && 
    bcrypt.compareSync(req.body.password, database.users[0].password)){
    // req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else{
        res.status(400).json("errou: " + req.body.email + " - " + bcrypt.compareSync(req.body.password, database.users[0].password));
    }
})

app.post("/register", (req, res) => {
    const {email, name, password} = req.body;
    const new_password = bcrypt.hashSync(password, saltRounds);
    bd('users')
    .returning('*')
    .insert({
        name: name,
        email: email,
        joined: new Date()
    }).then(user => {
        return res.json(user[0]);
    })
    .catch(err => res.status(400).json("não pode se registrar"));    
})

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id == id){
            found = true;
            return res.json(user);
        }            
    })
    if (!found)
        res.status(400).json("id " + id + " não encontrado");
})

app.put("/image/", (req, res) => {
    const { id } = req.body;   
    database.users.forEach(user => {
        if (user.id == id){
            user.entries ++;
            return res.json(user.entries);
        }            
    })
})

app.listen(3000, () => {
    console.log("o aplicativo está rodando");
})