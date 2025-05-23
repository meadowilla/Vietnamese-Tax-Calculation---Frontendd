import { Outlet } from 'react-router-dom';
import Header from './setup/Header';
import Footer from './setup/Footer';

const Layout = () => (
  <>
    <Header />
    <Outlet /> {/* This is where AboutScreen will render */}
    <Footer />
  </>
);

export default Layout;
