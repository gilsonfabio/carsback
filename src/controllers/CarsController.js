const { Console } = require('console');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const cars = await connection('cars')
        .orderBy('carId')
        .select('*');
    
        return response.json(cars);
    },    
        
    async create(request, response) {
        const {carMarId, carModId, carCaracter, carPlaca, carAno, carCorId, carKmAtual} = request.body;
        
        /*
        let datAtual = new Date();
        let year = datAtual.getFullYear();
        let month = datAtual.getMonth();
        let day = datAtual.getDate();
         
        let datProcess = new Date(year,month,day);
        let horProcess = moment().format('hh:mm:ss');
        */
        
        let status = "A";
        
        const [carId] = await connection('cars').insert({
            carMarId, 
            carModId, 
            carCaracter, 
            carPlaca, 
            carAno, 
            carCorId, 
            carKmAtual, 
            carStatus: status     
        });
         
        return response.json({carId});
    },    
};
