const { Console } = require('console');
const connection = require('../database/connection');
const moment = require('moment/moment');
const axios = require('axios');

const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;

module.exports = {   
    async index (request, response) {
        const viagens = await connection('viagens')
        .orderBy('viaId')
        .select('*');
    
        return response.json(viagens);
    },    
        
    async create(request, response) {
        try {
            const { viaUsrId, viaOriLat, viaOriLon, viaDesLat, viaDesLon, viaDistancia, motorista } = request.body;

            console.log("Recebendo requisição:", request.body);

            let datAtual = new Date();
            let year = datAtual.getFullYear();
            let month = datAtual.getMonth();
            let day = datAtual.getDate();
            let datProcess = new Date(year, month, day);
            let horProcess = moment().format('HH:mm:ss'); // Corrigido para formato 24h
            
            let status = "A";
            
            // Inserindo no banco
            const [viaId] = await connection('viagens').insert({
                viaDatSol: datProcess, 
                viaHorSol: horProcess,            
                viaUsrId, 
                viaOriLat, 
                viaOriLon, 
                viaDesLat, 
                viaDesLon, 
                viaDistancia, 
                viaStatus: status     
            });

            // Buscando usuário
            const driver = await connection('motoristas')
                .where('motId', motorista)
                .select('*')
                .first();

            if (!driver) {
                return response.status(404).json({ error: 'Motorista não encontrado' });
            }
            
            let expoPushToken = driver.mottoken;
            if (!expoPushToken) {
                return response.status(400).json({ error: "Token do Expo é obrigatório" });
            }
            
            let title = 'Teste de Solicitação'
            let body = 'Este é um teste de Solicitação de corrida!'

            const response = await axios.post(
                  "https://fcm.googleapis.com/fcm/send",
                  {
                    to: expoPushToken,
                    notification: { title, body },
                    data: { extraData: "Alguma informação extra" },
                  },
                  {
                    headers: {
                      Authorization: `key=${FCM_SERVER_KEY}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                response.json({ success: true, response: response.data });
        
        } catch (error) {
            response.status(500).json({ error: error.message });
        }   
    }    
};
