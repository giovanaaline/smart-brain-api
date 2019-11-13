const handleRegister = (req, res, bd, bcrypt, saltRounds, emailValidator) => {
    const { email, name, password } = req.body;
    if ((!email) || (!name) || (!password)){
      return res.status(411).json('erro de dados');
    }
    else if (!emailValidator.validate(email)){
      return res.status(412).json('e-mail inválido');
    }      
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
      .catch(err => res.status(410).json('erro de registro'))
}
module.exports = {
    handleRegister: handleRegister
};