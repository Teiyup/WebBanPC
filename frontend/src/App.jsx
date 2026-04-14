import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import HotProducts from './pages/HotProducts';
import NewProducts from './pages/NewProducts';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center py-5">Đang tải...</div>;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/hot-products" element={<HotProducts />} />
            <Route path="/new-products" element={<NewProducts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
