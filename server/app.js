import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import mqtt from 'mqtt';
import cors from 'cors';
import mongoose from 'mongoose';

const broker = 'mqtt://test.mosquitto.org';
const topicTX = '/TXHydroMasters';
const topicRX = '/RXHydroMasters';
const cooldown = 50000;

let latestSensorData = {
    waterPump: false,
    airPump: false,
    tds: 0,
    temp: 0,
    ph: 0
}

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET']
    }
});

app.use(cors());

/* --------------------------- MONGODB CONNECTION --------------------------- */
mongoose.connect('mongodb://localhost:27017/hydroMasters')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(`Error connecting to MongoDB: ${err}`);
});

const sensorSchema = new mongoose.Schema({
    date: String,
    time: String,
    temp: Number,
    tds: Number,
    ph: Number,
    airPump: Boolean,
    waterPump: Boolean
});

const Sensor = mongoose.model('Sensor', sensorSchema);

/* ----------------------------- MQTT CONNECTION ---------------------------- */
const mqttClient = mqtt.connect(broker);

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
let lastSaveTime = 0;

mqttClient.on('message', async (topic, message) => {
    let jsonMessage;

    try {
        jsonMessage = JSON.parse(message);
    }
    catch (error) {
        console.log(`Error parsing JSON message: ${error}`);
        return;
    }

    if (jsonMessage.waterPump != undefined)
        latestSensorData.waterPump = jsonMessage.waterPump

    if (jsonMessage.airPump != undefined)
        latestSensorData.airPump = jsonMessage.airPump

    if (jsonMessage.tds != undefined)
        latestSensorData.tds = jsonMessage.tds

    if (jsonMessage.temp != undefined)
        latestSensorData.temp = jsonMessage.temp

    if (jsonMessage.ph != undefined)
        latestSensorData.ph = jsonMessage.ph

    console.log(`Received message on ${topic}: ${JSON.stringify(jsonMessage)}`);

    const currentTime = Date.now();
    if (currentTime - lastSaveTime >= cooldown) {
        try {
            const newSensorData = await Sensor.create({
                date: jsonMessage.date,
                time: jsonMessage.time,
                temp: jsonMessage.temp,
                tds: jsonMessage.tds,
                ph: jsonMessage.ph,
                airPump: jsonMessage.airPump,
                waterPump: jsonMessage.waterPump
            });
            console.log(`Sensor data saved to MongoDB: ${newSensorData}`);
            lastSaveTime = currentTime;
        }
        catch (error) {
            console.log(`Error saving sensor data to MongoDB: ${error}`);
        }
    }
    else {
        console.log(`Cooldown time not reached, skipping save to MongoDB`);
    }

    io.emit('message', JSON.parse(message));
});

/* -------------------------- WEB SOCKET CONNECTION ------------------------- */
io.on('connection', (socket) => {
    console.log('New user connected');
    // change to actual status of the switch when a new user connects
    socket.emit('message', latestSensorData);

    socket.on('pumpState', ({ pump, status }) => {
        if (pump === 'waterPump') {
            latestSensorData.waterPump = status;
        } else if (pump === 'airPump') {
            latestSensorData.airPump = status;
        }

        const jsonMessage = JSON.stringify(latestSensorData);

        console.log(`Enviando mensaje al topic ${topicRX}: ${jsonMessage}`);
        mqttClient.publish(topicRX, jsonMessage); // Enviar datos al ESP32

        // Emitir el estado actualizado a todos los clientes
        io.emit('message', latestSensorData);
    });


    socket.on('disconnect', () => {
        console.log('A user has disconnected');
    });
});

/* --------------------------------- EXPRESS -------------------------------- */
app.get('/', (req, res) => {
    const filePath = 'index.html';
    //console.log(filePath);
    res.sendFile(process.cwd() + '/' + filePath); // verrify this line on windows
    // process.cwd() + '/client/index.html'
});

app.get('/api/sensorData', async (req, res) => {
    try {
        const sensorData = await Sensor.find();
        res.json(sensorData);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});