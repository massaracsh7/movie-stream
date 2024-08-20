import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function NavigationLayout() {
  return (
    <div className="wrapper">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default NavigationLayout;
