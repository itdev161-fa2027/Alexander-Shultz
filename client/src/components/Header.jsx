import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-title">
          <h1>My Blog</h1>
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          {/* Login and Register links will be added in Activity 8 */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
