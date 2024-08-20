import { Link, NavLink } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  const isAuthenticated = () => {
    // Replace this with your actual authentication logic
    return true; // Set to true if the user is authenticated
  };
  const authenticated = isAuthenticated();

  return (
    <header className="header">
      <div className="header__content container">
        <Link className='logo' to='/' />
        <h1 className="header__title">Movie Stream - JS Wisard</h1>
        <nav className="header__navigation">
          {!authenticated ? (
            <>
              <NavLink to="/" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>Main</NavLink>
              <NavLink to="/catalog" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>Catalog</NavLink>
              <NavLink to="/cart" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>Cart</NavLink>
              <NavLink to="/about" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>About</NavLink>
              <NavLink to="/login" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>LogIn</NavLink>
              <NavLink to="/registration" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>Registration</NavLink>
            </>
          ) : (
            <>
                <NavLink to="/" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>Main</NavLink>
                <NavLink to="/catalog" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>Catalog</NavLink>
                <NavLink to="/cart" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>Cart</NavLink>
                <NavLink to="/about" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>About</NavLink>
                <NavLink to="/profile" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>Profile</NavLink>
                <NavLink to="/logout" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`}>Logout</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
