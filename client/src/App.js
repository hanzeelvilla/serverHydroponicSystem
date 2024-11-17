import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Title from './components/Title';
import CardSensor from './components/CardSensor';
import CardBomba from './components/CardBomba';
import { io } from 'socket.io-client';

function App() {
  const [infoSensores, setInfoSensores] = useState([
    { nombre: 'TDS (Total Disolved Solids)', url: 'https://cdn-icons-png.flaticon.com/512/7225/7225279.png', data: 0 },
    { nombre: 'PH', url: 'https://cdn-icons-png.flaticon.com/512/310/310073.png', data: 0 },
    { nombre: 'Temperatura', url: 'https://cdn-icons-png.flaticon.com/512/11106/11106505.png', data: 0 },
  ]);

  const [infoBombas, setInfoBombas] = useState([
    { nombre: 'Bomba de agua', url: 'https://cdn-icons-png.freepik.com/512/3799/3799458.png', state: false },
    { nombre: 'Bomba de aire', url: 'https://cdn-icons-png.flaticon.com/512/6615/6615696.png', state: false },
  ]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('message', (data) => {
      console.log(data)
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

        if (parsedData.waterPump !== undefined) {
          setInfoBombas((prevState) => 
            prevState.map((bomba) => bomba.nombre === "Bomba de agua" ? {...bomba, state: parsedData.waterPump} : bomba)
          )
        }

        if (parsedData.airPump !== undefined) {
          setInfoBombas((prevState) => 
            prevState.map((bomba) => bomba.nombre === "Bomba de aire" ? {...bomba, state: parsedData.airPump} : bomba)
          )
        }

        if (parsedData.tds !== undefined) {
          setInfoSensores((prevState) => 
            prevState.map((sensor) => sensor.nombre === "TDS (Total Disolved Solids)" ? {...sensor, data: parsedData.tds} : sensor)
          )
        }

        if (parsedData.temp !== undefined) {
          setInfoSensores((prevState) => 
            prevState.map((sensor) => sensor.nombre === "Temperatura" ? {...sensor, data: parsedData.temp} : sensor)
          )
        }

        if (parsedData.ph !== undefined) {
          setInfoSensores((prevState) => 
            prevState.map((sensor) => sensor.nombre === "PH" ? {...sensor, data: parsedData.ph} : sensor)
          )
        }

        // if (parsedData.type === 'sensor') {
        //   setInfoSensores((prevState) =>
        //     prevState.map((sensor) =>
        //       sensor.nombre === parsedData.nombre
        //         ? { ...sensor, data: parsedData.data }
        //         : sensor
        //     )
        //   );
        // }
      } catch (error) {
        console.error('Error al procesar el mensaje:', error);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

const updateBombaState = (index, newState) => {
  setInfoBombas((prevState) => {
    return prevState.map((bomba, i) =>
      i === index ? { ...bomba, state: newState } : bomba
    );
  });

  // Emitir mensaje al servidor para notificar el cambio de estado
  if (socket) {
    const bombaName = infoBombas[index].nombre;
    if (bombaName === "Bomba de agua") {
      socket.emit('pumpState', { pump: 'waterPump', status: newState });
    }
    if (bombaName === "Bomba de aire") {
      socket.emit('pumpState', { pump: 'airPump', status: newState });
    }
  }
};

  return (
    <>
      <Header />
      <div className="main">
        <Title>Sensores</Title>
        <div className="div-sensores">
          {infoSensores.map((sensor) => (
            <CardSensor key={sensor.nombre} url={sensor.url} data={sensor.data}>
              {sensor.nombre}
            </CardSensor>
          ))}
        </div>
        <Title>Bombas</Title>
        <div className="div-bombas">
          {infoBombas.map((bomba, index) => (
            <CardBomba
              key={bomba.nombre}
              url={bomba.url}
              state={bomba.state}
              onStateChange={(newState) => updateBombaState(index, newState)}
            >
              {bomba.nombre}
            </CardBomba>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
