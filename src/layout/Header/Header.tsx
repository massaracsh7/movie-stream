import { Link, NavLink } from 'react-router-dom';
import './Header.scss';
import { useSelector } from 'react-redux';
import { MdShoppingCart } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { RootState } from '@/store/store';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const authenticated = useSelector((state: RootState) => state.auth.isSignedIn);
  const itemCount = useSelector((state: RootState) => state.cart.items.length);
  const menuRef = useRef<HTMLDivElement>(null); 

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__content container" ref={menuRef}>
        <Link className="logo" to="/" />
        <h1 className="header__title">Movie Stream - JS Wisard</h1>
        <button className="burger-menu" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <nav className={`header__navigation ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>Main</NavLink>
          <NavLink to="/products" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>Catalog</NavLink>
          <NavLink to="/about" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>About</NavLink>
          {!authenticated ? (
            <>
              <NavLink to="/login" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>LogIn</NavLink>
              <NavLink to="/registration" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>Registration</NavLink>
            </>
          ) : (
            <NavLink to="/profile" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>Profile</NavLink>
          )}
          <NavLink to="/cart" className={({ isActive }) => `header__link link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
            <div className="shopping-cart-container">
              <MdShoppingCart size={24} />
              {itemCount > 0 && <span className="item-count">{itemCount}</span>}
            </div>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
