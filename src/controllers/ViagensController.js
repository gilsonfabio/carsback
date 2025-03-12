const connection = require('../database/connection');
const moment = require('moment');
const { Expo } = require('expo-server-sdk');

//... d9264a56-4e4f-4ed5-9c8d-07ce302e59bb       /// 64b17201-dec9-4c34-beb7-f6121faf5084

const expo = new Expo(); // Instância do Expo SDK

module.exports = {   
    async index(request, response) {
        try {
            const viagens = await connection('viagens').orderBy('viaId').select('*');
            return response.json(viagens);
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    },    
        
    async create(request, response) {
        try {
            const { viaUsrId, viaOriLat, viaOriLon, viaDesLat, viaDesLon, viaDistancia, motorista } = request.body;

            console.log("Recebendo requisição:", request.body);

            let datAtual = new Date();
            let datProcess = new Date(datAtual.getFullYear(), datAtual.getMonth(), datAtual.getDate());
            let horProcess = moment().format('HH:mm:ss'); // Correção do formato de hora
            
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

            console.log('Passei pelo motorista');
            
            let expoPushToken = driver.mottoken;
            if (!expoPushToken || !Expo.isExpoPushToken(expoPushToken)) {
                return response.status(400).json({ error: "Token do Expo inválido ou não fornecido" });
            }

            console.log('Passei pelo token:', expoPushToken);

            // Criando a notificação
            const message = {
                to: expoPushToken,
                sound: 'default',
                title: 'Nova Corrida Disponível!',
                body: 'Uma nova corrida foi solicitada. Verifique o aplicativo!',
            };

            // Enviando a notificação
            let pushReceipts = await expo.sendPushNotificationsAsync([message]);

            console.log('Notificação enviada com sucesso:', pushReceipts);

            return response.status(201).json({ success: true, viaId, notification: pushReceipts });
       
        } catch (error) {
            console.error('Erro no servidor:', error);
            return response.status(500).json({ error: error.message });
        }
    }    
};
