import './Title.css'

const Title = (props) => {
    const { children } = props

    return (
        <div className='container'>
            <h1 className='title'>{ children }</h1>
        </div>
    )
}

export default Title