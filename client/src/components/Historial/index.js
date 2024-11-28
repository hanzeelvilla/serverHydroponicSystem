import Header from '../Header'
import './Historial.css'

const Historial = (props) => {

    const { dataHistorial } = props;
    console.log(dataHistorial)

    return (
        <>
            <Header />
            <div className='main'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Bomba agua</th>
                            <th>Bomba aire</th>
                            <th>Temperatura agua</th>
                            <th>TDS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataHistorial.map((register, index) => {
                            return (
                                <tr key={index}>
                                    <td>{ register.date }</td>
                                    <td>{ register.time }</td>
                                    <td>{ register.waterPump === true ? "Activada" : "Desactivada" }</td>
                                    <td>{ register.airPump === true ? "Activada" : "Desactivada"  }</td>
                                    <td>{ register.temp }°C</td>
                                    <td>{ register.tds }ppm</td>
                                </tr>
                            )
                        }) }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Historial