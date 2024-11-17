import { useState, useEffect } from 'react';
import './CardBomba.css';
import Switch from '@mui/material/Switch';

const CardBomba = (props) => {
  const { children, url, state, onStateChange } = props;
  const [checked, setChecked] = useState(state);

  const handleChange = (event) => {
    const newState = event.target.checked;
    setChecked(newState);
    onStateChange(newState); // Notificar al padre sobre el cambio
  };

  // Sincronizar el estado interno si la prop `state` cambia
  useEffect(() => {
    setChecked(state);
  }, [state]);

  return (
    <div className="card-container">
      <h3 className="card-label">{children}</h3>
      <img className="card-img" src={url} alt={`logo-${children}`} />
      <Switch
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
      />
    </div>
  );
};

export default CardBomba;
