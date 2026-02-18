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
import PostJob from './pages/Admin/PostJob';
import AppliedCandidates from './pages/Admin/AppliedCandidates';
import RecruiterManager from './pages/Admin/RecruiterManager';
import StaffManager from './pages/Admin/StaffManager';
import TourManager from './pages/Admin/TourManager';
import BookingManager from './pages/Admin/BookingManager';
import AnalyticsDashboard from './pages/Admin/AnalyticsDashboard';
import CommunicationCenter from './pages/Admin/CommunicationCenter';
import PushNotificationCenter from './pages/Admin/PushNotificationCenter';

// ✅ MainLayout fix: Eikhane Outlet na thakle Home/Login page ashbe na
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet /> 
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 PUBLIC PAGES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* 🔐 ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 📊 ADMIN DASHBOARD (Protected) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['superadmin', 'admin', 'editor', 'hr_manager', 'moderator']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          {/* Index route: /admin dhuklei dashboard dekhabe */}
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="visa-categories" element={<VisaCategories />} />
          <Route path="country-list" element={<CountryList />} />
          <Route path="applications" element={<Applications />} />
          <Route path="blogs/create" element={<UploadBlog />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="candidates" element={<AppliedCandidates />} />
          <Route path="recruiters" element={<RecruiterManager />} />
          <Route path="staff-management" element={<StaffManager />} />
          <Route path="tour-packages" element={<TourManager />} />
          <Route path="bookings" element={<BookingManager />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="notifications" element={<CommunicationCenter />} />
          <Route path="push-alerts" element={<PushNotificationCenter />} />
        </Route>

        <Route path="*" element={<h1 className="text-center mt-20 text-3xl font-black italic">404 - LOST IN SPACE</h1>} />
      </Routes>
    </Router>
  );
}

export default App;