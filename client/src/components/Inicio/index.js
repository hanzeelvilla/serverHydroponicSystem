import React from 'react';
import './Inicio.css'
import Header from '../Header';
import Title from '../Title';
import CardSensor from '../CardSensor';
import CardBomba from '../CardBomba';
import { Link } from 'react-router-dom';

const Inicio = ({ infoSensores, infoBombas, updateBombaState }) => {
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
        <Link to={"historial"} className='link'>Ver historial</Link>
      </div>
    </>
  );
};

export default Inicio;
