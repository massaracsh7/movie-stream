import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
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


const App = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isSignedIn);


  return (
    <BrowserRouter>
      <Routes>
        {/* Routes wrapped in NavigationLayout */}
        <Route path="/" element={<NavigationLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/catalog" element={<CatalogProductPage />} />
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
  );
};

export default App;
