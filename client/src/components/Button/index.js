import './Button.css'

const Button = (props) => {

    const {children} = props
    
    return (
        <button>{ children }</button>
    )
}

export default Button