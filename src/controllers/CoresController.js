const { Console } = require('console');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const cores = await connection('cores')
        .orderBy('corId')
        .select('*');
    
        return response.json(cores);
    },    
        
    async create(request, response) {
        const {corDescricao} = request.body;
 
        const [corId] = await connection('cores').insert({
            corDescricao, 
        });
         
        return response.json({corId});
    },    
};
