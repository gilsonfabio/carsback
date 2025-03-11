const connection = require('../database/connection');
const moment = require('moment/moment');
const axios = require('axios');

const Expo = require('expo-server-sdk');

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

            const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;

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

            console.log('Passei pelo motorista')
            
            let expoPushToken = driver.mottoken;
            if (!expoPushToken) {
                return response.status(400).json({ error: "Token do Expo é obrigatório" });
            }

            console.log('Passei pelo token', expoPushToken)

            //................................................................................................................
            
            const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

            async function sendPushNotification(expoPushToken) {
                
                const title = 'Notificação Expo';
                const message = 'Essa é uma notificação teste do servidor expo';

                try {
                    const response = await axios.post(EXPO_PUSH_URL, {
                        to: expoPushToken,  
                        sound: 'default',
                        title,
                        body: message,
                    });

                    console.log('Notificação enviada com sucesso:', response.data);
                    return { success: true, response: response.data };
                } catch (error) {
                    console.error('Erro ao enviar notificação:', error.message);
                    return { success: false, error: error.message };
                }           
            }

            sendPushNotification(expoPushToken);
            
            //................................................................................................................
       
        } catch (error) {
            response.status(500).json({ error: error.message });
        }   

        return
    }    
};
