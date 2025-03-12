require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const FCM_URL = "https://fcm.googleapis.com/fcm/send";

const admin = require("firebase-admin");

// Inicializar Firebase Admin SDK

//const serviceAccount = require("../../firebase-service-account.json");
//admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
//});
const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf-8")
);
  
if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
}

module.exports = {   
    
    async travel(req, res) {
    
        const { token, title, body, data } = req.body;

        if (!token || !title || !body) {
            return res.status(400).json({ error: "Token, title e body são obrigatórios" });
        }

        const message = {
            token,
            notification: { title, body },
            data: data || {}, // Dados extras opcionais
        };

        try {
            const response = await admin.messaging().send(message);
            res.json({ success: true, response });
        } catch (error) {
            res.status(500).json({ error: "Erro ao enviar notificação", details: error.message });
        }
    }
}
    