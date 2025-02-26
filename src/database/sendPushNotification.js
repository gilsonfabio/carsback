const { Expo } = require('expo-server-sdk');

let expo = new Expo();

async function sendPushNotification(token, message, data) {
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Token ${token} is not a valid Expo push token`);
    return;
  }

  let messages = [];
  messages.push({
    to: token,
    sound: 'default',
    body: message,
    data: data,
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
}