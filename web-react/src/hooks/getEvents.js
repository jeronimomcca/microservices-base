import mqtt from 'mqtt';

// connect to Mosquitto broker
const client = mqtt.connect('ws://localhost:9001');

// subscribe to topic
client.on('connect', () => {
  client.subscribe('my_app/events');
});

// handle incoming messages
client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
});
