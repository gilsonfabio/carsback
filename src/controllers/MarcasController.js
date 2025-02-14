const { Console } = require('console');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const marcas = await connection('marcas')
        .orderBy('marId')
        .select('*');
    
        return response.json(marcas);
    },    
        
    async create(request, response) {
        const {marDescricao} = request.body;
 
        const [marId] = await connection('marcas').insert({
            marDescricao, 
        });
         
        return response.json({marId});
    },    
};
