# server Hydroponic System

HydroMasters is a full-stack application designed for monitoring and controlling environmental parameters in a hydroponics system. It uses MQTT, WebSockets, and MongoDB to manage sensor data and device states in real-time.

## Features

- **Real-Time Monitoring:** Displays live sensor data such as TDS (Total Dissolved Solids), pH, and temperature.
- **Device Control:** Remotely control water and air pumps.
- **Historical Data:** Fetch and view historical sensor data from MongoDB.
- **Responsive Client UI:** Built with React, the client displays data dynamically and updates in real-time via WebSockets.

## Tech Stack

### Backend
- **Node.js**: Server-side runtime.
- **Express**: Web framework.
- **Socket.IO**: WebSocket communication for real-time updates.
- **MQTT.js**: MQTT protocol for communication with IoT devices.
- **MongoDB**: Database for storing sensor data.

### Frontend
- **React**: Frontend framework for the user interface.
- **React Router**: For routing between views.
- **Socket.IO Client**: Real-time communication with the server.

## Installation

### Prerequisites
- Node.js (v18 or above)
- MongoDB
- A compatible MQTT broker (default: `mqtt://test.mosquitto.org`)

### Steps
1. Clone the repository:
   ```bash
   https://github.com/hanzeelvilla/serverHydroponicSystem.git
   cd serverHydroponicSystem

2. Install the server dependencies
    ```bash
    cd server
    npm i
    ```

3. Install the client dependencies
    ```bash
    cd ..
    cd client
    npm i
    ```

## Start the app

1. Start the backend
    ```bash
    npm run dev
    ```

2. Start the fronted
    ```bash
    npm run start
    ```

> [!WARNING]
> First run the backend then the frontend

