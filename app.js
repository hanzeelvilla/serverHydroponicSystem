import express from 'express';
import path from 'node:path';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import mqtt from 'mqtt';

const broker = 'mqtt://test.mosquitto.org';
const topic = '/hanzeelVilla';

const app = express();
const server = createServer(app);
const io = new Server(server);

const mqttClient = mqtt.connect(broker);

/* ----------------------------- MQTT CONNECTION ---------------------------- */
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(topic, (err) => {
        if (err)
            console.log('Error subscribing to topic');
        else
            console.log('Subscribed to topic');
    });
});

/* ------------------------- MQTT RECEIVE A MESSAGE ------------------------- */
mqttClient.on('message', (topic, message) => {
    console.log(`Received message on ${topic}: ${message.toString()}`);
    io.emit('message', message.toString());
});

/* -------------------------- WEB SOCKET CONNECTION ------------------------- */
io.on('connection', () => {
    console.log('new user connected');
});

/* --------------------------------- EXPRESS -------------------------------- */
app.get('/', (req, res) => {
    const filePath = path.join('client', 'index.html')
    //console.log(filePath);
    res.sendFile(process.cwd() + '/' + filePath); // verrify this line on windows
    // process.cwd() + '/client/index.html'
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});