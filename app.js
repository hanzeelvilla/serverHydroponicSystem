import express from 'express';
import path from 'node:path';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import mqtt from 'mqtt';

const broker = 'mqtt://test.mosquitto.org';
const topicTX = '/TXhanzeelVilla';
const topicRX = '/RXhanzeelVilla';

let switchStatus = {
    waterPump: false,
    airPump: false
}

const app = express();
const server = createServer(app);
const io = new Server(server);

const mqttClient = mqtt.connect(broker);

/* ----------------------------- MQTT CONNECTION ---------------------------- */
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    mqttClient.subscribe(topicTX, (err) => {
        if (err)
            console.log(`Error subscribing to topic ${topicTX}`);
        else
            console.log(`Subscribed to topic ${topicTX}`);
    });
});

/* ------------------------- MQTT RECEIVE A MESSAGE ------------------------- */
mqttClient.on('message', (topic, message) => {
    const jsonMessage = JSON.parse(message);
    console.log(`Received message on ${topic}: ${JSON.stringify(jsonMessage)}`);

    io.emit('message', jsonMessage);
});

/* -------------------------- WEB SOCKET CONNECTION ------------------------- */
io.on('connection', (socket) => {
    console.log('New user connected');
    // change to actual status of the switch when a new user connects
    socket.emit('message', JSON.stringify(switchStatus));

    // turn on/off water pump
    socket.on('waterPump', (status) => {
        switchStatus.waterPump = status;
        const jsonMessage = JSON.stringify(switchStatus);

        console.log(`Sending message to topic ${topicRX}`);
        mqttClient.publish(topicRX, jsonMessage); // sending data to esp32

        io.emit('message', jsonMessage);
    });

    // turn on/ff air pump
    socket.on('airPump', (status) => {
        switchStatus.airPump = status;
        const jsonMessage = JSON.stringify(switchStatus);

        console.log(`Sending message to topic ${topicRX}`);
        mqttClient.publish(topicRX, jsonMessage); // sending data to esp32

        io.emit('message', jsonMessage);
    });

    socket.on('disconnect', () => {
        console.log('A user has disconnected');
    });
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