const handleSignin = (req, res, bd, bcrypt) => {
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
}
module.exports = {
  handleSignin: handleSignin
};