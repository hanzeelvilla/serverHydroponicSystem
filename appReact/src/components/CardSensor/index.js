import './CardSensor.css'

const CardSensor = (props) => {

    const { children, url, data } = props

    return (
        <div className='card-container'>
            <h3 className='card-label'>{ children }</h3>
            <img src={ url } alt={`icon-${children}`} className='card-img'></img>
            <p className='card-data'> { data }</p>
        </div>
    )
}

export default CardSensor