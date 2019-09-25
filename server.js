const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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
        password: '$2b$10$EFGC3dSktyL8LzyAf/Ipn.BrV0SVrys/PkbcdNqncVbLjPQCWvF/.',
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
        res.json('sucesso');
    } else{
        res.status(400).json("errou");
    }
})

app.post("/register", (req, res) => {
    const {email, name, password} = req.body;
    const new_password = bcrypt.hashSync(password, saltRounds);
    console.log(new_password);
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: new_password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length - 1]);
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

app.post("/image/", (req, res) => {
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