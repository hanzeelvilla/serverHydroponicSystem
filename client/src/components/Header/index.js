import './Header.css'
import logo from '../../logo.svg';


const Header = () => {
    return (
        <header>
            <img src={logo} alt='logo'></img>
            <p>Cultivo hidropónico</p>
        </header>
    )
}

export default Header