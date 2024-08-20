import { NavLink } from 'react-router-dom';

const Header = () => {
  const isAuthenticated = () => {
    // Replace this with your actual authentication logic
    return true; // Set to true if the user is authenticated
  };
  const authenticated = isAuthenticated();

  return (
    <header className="header">
      <div className="header__content container">
        <div className="header__links">
          {!authenticated ? (
            <>
              <NavLink to="/" className="link">Main</NavLink>
              <NavLink to="/login" className="link">LogIn</NavLink>
              <NavLink to="/registration" className="link">Registration</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/catalog" className="link">Catalog</NavLink>
              <NavLink to="/cart" className="link">Cart</NavLink>
              <NavLink to="/profile" className="link">Profile</NavLink>
              <NavLink to="/about" className="link">About</NavLink>
              <NavLink to="/logout" className="link">Logout</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
