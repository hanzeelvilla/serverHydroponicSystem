import './Header.css'
import logo from '../../logo.png';


const Header = () => {
    return (
        <header>
            <img src={logo} alt='logo'></img>
            <p>Hydro Masters</p>
        </header>
    )
}

export default Header