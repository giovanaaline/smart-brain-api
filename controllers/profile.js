const handleProfile = (req, res, bd) => {
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
}
module.exports = {
  handleProfile: handleProfile
};