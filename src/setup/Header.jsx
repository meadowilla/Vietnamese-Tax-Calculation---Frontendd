import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser } from '../redux/UserSlice';

function Header() {
  const user = useSelector(selectUser);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(logout());
  };

  useEffect(() => {
    const btn = document.getElementById('menu-btn');
    const nav = document.getElementById('menu');

    function navToggle() {
      btn.classList.toggle('open');
      nav.classList.toggle('hidden');
      document.body.classList.toggle('no-scroll');
    }

    btn.addEventListener('click', navToggle);

    return () => {
      btn.removeEventListener('click', navToggle);
    };
  }, []);

  return (
    <header className='header'>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/lotest.jpeg" alt="Vietnamese Tax Calculation" />
            </Link>
          </div>

          <ul className="navbar-nav-left">
            <li><Link to="/sotay">Sổ tay</Link></li>
            <li><Link to="/tinhthuethang">Tính thuế</Link></li>
            <li><Link to="/user/luutru">Lưu trữ</Link></li>
            <li><Link to="/lienhe">Liên hệ</Link></li>
          </ul>
          {!user 
            ? <ul className="navbar-nav-right">
              <li>
                <Link to="/account/signin" className="btn ">Đăng nhập</Link>
              </li>
              <li>
                <Link to="/account/create" className="btn btn-dark">Đăng ký</Link>
              </li>
            </ul>
            : <ul className="navbar-nav-right">
              <li>
                <Link to="/" onClick={handleLogout} className="btn btn-dark">Đăng xuất</Link>
              </li>
            </ul>
          }

          {/* Hamburger Menu */}
          <button type="button" className="hamburger" id="menu-btn">
            <span className="hamburger-top"></span>
            <span className="hamburger-middle"></span>
            <span className="hamburger-bottom"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="mobile-menu hidden" id="menu">
        <ul>
          <li><Link to="/sotay">Sổ tay</Link></li>
          <li><Link to="/tinhthuethang">Tính thuế</Link></li>
          <li><Link to="/user/luutru">Lưu trữ</Link></li>
          <li><Link to="/lienhe">Liên hệ</Link></li>
        </ul>
        {!user ? (
          <div className="mobile-menu-bottom">
          <Link to="/account/signin" className="btn btn-dark-outline">Đăng nhập</Link>
          <Link to="/account/create" className="btn btn-dark">Đăng ký</Link>
        </div>
        ) : (
          <div className="mobile-menu-bottom">
            <Link to="/" onClick={handleLogout} className="btn btn-dark">Đăng xuất</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
