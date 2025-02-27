const { Expo } = require('expo-server-sdk');

    let expo = new Expo();

    async function sendPushNotification(token, message) {
      if (!Expo.isExpoPushToken(token)) {
        console.error(`Token ${token} is not a valid Expo push token`);
        return;
      }

      console.log(token)

      let messages = [];
      messages.push({
        to: token,
        sound: 'default',
        body: message,
        data: { withSome: 'data' }, // Dados adicionais que você pode usar no aplicativo
      });

      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();
      
      // Exemplo de uso
      const pushToken = token; // Substitua pelo token real
      const notificationMessage = 'Sua notificação chegou!';

      sendPushNotification(pushToken, notificationMessage);
    }
