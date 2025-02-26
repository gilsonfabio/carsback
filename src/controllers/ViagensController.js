const { Console } = require('console');
const connection = require('../database/connection');
const moment = require('moment/moment');
const axios = require('axios');

const sendPushNotification = require('../database/sendPushNotification');

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

            let token = driver.mottoken;
            if (!token) {
                return response.status(400).json({ error: 'Token do dispositivo é obrigatório' });
            }

            let title = 'Teste de Notificação Node.js';
            let message = `Olá ${driver.motNome}, Existe uma solicitação para você.`;

            const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

            const notificationData = {
                action: 'OPEN_APP', // Indica que a notificação deve abrir o app
                screen: 'HomeScreen', // Opcional: para abrir uma tela específica
            };

            sendPushNotification(token, message, notificationData);

            // Enviando notificação via Expo
            //const pushResponse = await axios.post(EXPO_PUSH_ENDPOINT, {
            //    to: token,
            //    sound: 'default',
            //    title,
            //    body: message,
            //}, {
            //    headers: {
            //        'Content-Type': 'application/json'
            //    }
            //});

            //console.log("Resposta do Expo:", pushResponse.data);

            // ✅ Agora retorna corretamente a resposta no Express
            //return response.json({ success: true, viaId, pushResponse: pushResponse.data });

        } catch (error) {
            console.error("Erro no processamento:", error);
            return response.status(500).json({ error: error.message });
        }
    }
};
