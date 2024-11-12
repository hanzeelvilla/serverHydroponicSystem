# serverHydroponicSystem

`serverHydroponicSystem` is a basic Node.js server application that connects to an MQTT broker and listens to messages from a hydroponic system. The server uses WebSocket to emit these messages to connected clients in real time. It includes a simple HTML frontend for monitoring incoming messages.

## Features

- Connects to an MQTT broker (`mqtt://test.mosquitto.org`) to subscribe to a topic (`/hanzeelVilla`).
- Broadcasts received messages to connected WebSocket clients.
- Simple Express server to serve an HTML file for real-time monitoring.

## Project Structure

- `app.js`: Main server file that handles MQTT and WebSocket connections.
- `client/index.html`: Basic frontend HTML file for receiving and displaying messages in the browser console.

## Prerequisites

- Node.js installed on your system
- MQTT Broker (this example uses Mosquitto’s public broker for testing)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/hanzeelvilla/serverHydroponicSystem.git
    cd serverHydroponicSystem
    ```

2. Install dependencies:

    ```bash
    npm i
    ```

## Usage

1. Start the server in development mode:

    ```bash
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000` to view the frontend.

3. Any messages published to the MQTT topic `/hanzeelVilla` will appear in the browser console.

## Code Overview

### `app.js`

- Initializes an MQTT client connected to the broker.
- Subscribes to the MQTT topic and listens for messages.
- Sets up a WebSocket connection to broadcast incoming MQTT messages to connected clients.
- Serves an HTML file as a basic frontend for monitoring.

### `client/index.html`

- A simple HTML page that connects to the WebSocket server.
- Displays messages received in the browser console.
