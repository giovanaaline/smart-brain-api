const Clarifai = require ('clarifai');
const app = new Clarifai.App({
    apiKey: 'e390ef8dd16d49cb8090d59da16b5295'
  });
  const handleApiCall = (req, res) => { 
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('erro ao trabalhar com o Clarifai'))
  }
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
    handleImage: handleImage,
    handleApiCall: handleApiCall
};