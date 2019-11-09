const handleImage = (req, res, bd) => {
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
}
module.exports = {
    handleImage: handleImage
};