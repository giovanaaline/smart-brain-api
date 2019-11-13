const handleSignin = (req, res, bd, bcrypt, emailValidator) => {
    const { email, name, password } = req.body;
    if ((!email) || (!password)) {
        return res.status(411).json('erro de dados');
    }
    else if (!emailValidator.validate(email)) {
        return res.status(412).json('e-mail inválido');
    } 
  bd.select('email', 'hash').from('login').where('email', '=', email)
.then(resquery => {        
    if (resquery.length){
        const ehValido = bcrypt.compareSync(password, resquery[0].hash);
        if (ehValido){
            bd.select('*').from('users').where('email', '=', email)
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