import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Footer from './components/Footer';
import AdminLogin from './pages/Admin/AdminLogin';
import DashboardHome from './pages/Admin/DashboardHome';
import AdminLayout from './pages/Admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import VisaCategories from './pages/Admin/VisaCategories';
import CountryList from './pages/Admin/CountryList';
import Applications from './pages/Admin/Applications';
import UploadBlog from './pages/Admin/UploadBlog';
import BlogList from './pages/Admin/BlogList';

// 🏠 Website Layout (Jekhane normal Navbar/Footer thakbe)
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet /> {/* Eikhane Home, Login etc render hobe */}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 PUBLIC PAGES: Navbar/Footer shoho */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* 🔐 ADMIN LOGIN: Ekebare alada design-er hobe (No Footer/Navbar) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 📊 ADMIN DASHBOARD: Shudhu Admin Sidebar thakbe */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="visa-categories" element={<VisaCategories />} />
          <Route path="country-list" element={<CountryList />} />
          <Route path="applications" element={<Applications />} />
          <Route path="blogs/create" element={<UploadBlog />} />
          <Route path="blogs" element={<BlogList />} />  
        </Route>

        {/* ❌ 404 PAGE */}
        <Route path="*" element={<h1 className="text-center mt-20">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;