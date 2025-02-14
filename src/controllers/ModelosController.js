const { Console } = require('console');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const modelos = await connection('modelos')
        .orderBy('modId')
        .select('*');
    
        return response.json(modelos);
    },    
        
    async create(request, response) {
        const {modDescricao, modMarId} = request.body;
 
        const [modId] = await connection('modelos').insert({
            modDescricao,
            modMarId 
        });
         
        return response.json({modId});
    },    
};
