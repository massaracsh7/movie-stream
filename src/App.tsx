import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';

import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import CatalogProductPage from './pages/CatalogProductPage/CatalogProductPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import AboutUsPage from './pages/AboutUsPage/AboutUsPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import NavigationLayout from './layout/NavigationLayout';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import BasketPage from './pages/BasketPage/BasketPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';


const App = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isSignedIn);
  Modal.setAppElement('#root');

  return (
    <>
      <ToastContainer />
      <BrowserRouter basename="/">
        <Routes>
          {/* Routes wrapped in NavigationLayout */}
          <Route path="/" element={<NavigationLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<MainPage />} />
            <Route path='products' element={<CatalogProductPage />} />
            <Route path='products/:id' element={<ProductDetailPage />} />
            <Route path='products/category/:url' element={<CategoryPage />} />
            <Route path="/cart" element={<BasketPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/registration" element={isAuthenticated ? <Navigate to="/" /> : <RegistrationPage />} />

            {/* Protected Routes */}
            {isAuthenticated && (
              <>
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/about" element={<AboutUsPage />} />
              </>
            )}

            {/* Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
