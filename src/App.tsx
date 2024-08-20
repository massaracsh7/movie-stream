import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import MainOrLoginRoute from "./layout/MainOrLoginRoute";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage";
import BasketPage from "./pages/BasketPage/BasketPage";
import CatalogProductPage from "./pages/CatalogProductPage/CatalogProductPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Footer from "./layout/Footer";

function App() {

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<MainPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegistrationPage />} />

        {/* Protected routes */}
        <Route path='/' element={<MainOrLoginRoute />}>
          <Route path='about' element={<AboutUsPage />} />
          <Route path='basket' element={<BasketPage />} />
          <Route path='products' element={<CatalogProductPage />} />
          <Route path='products/:id' element={<ProductDetailPage />} />
          <Route path='products/category/:url' element={<CategoryPage />} />
          <Route path='profile' element={<UserProfilePage />} />
        </Route>

        {/* Fallback route for undefined paths */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;