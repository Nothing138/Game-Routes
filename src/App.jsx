import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';

// Admin Pages
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
import ManageRecruiters from './pages/Admin/ManageRecruiters';

// ✅ Recruiter Pages
import RecruiterLayout from './pages/Recruiter/RecruiterLayout';
import RecruiterDashboard from './pages/Recruiter/RecruiterDashboard';
import RecruiterPostJob from './pages/Recruiter/PostJob';

// Dummy components pore ready korbo

const RecruiterJobs = () => <div className="p-10 bg-white rounded-[40px] shadow-sm font-black italic uppercase text-slate-400">My Posted Jobs - Coming Soon</div>;

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
          <Route path="manage-recruiters" element={<ManageRecruiters />} />
        </Route>

        {/* 🏢 RECRUITER DASHBOARD (Protected) */}
        <Route path="/recruiter" element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <RecruiterLayout />
          </ProtectedRoute>
        }>
          {/* Default: /recruiter dhukle dashboard dekhabe */}
          <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="post-job" element={<RecruiterPostJob />} />
          <Route path="my-jobs" element={<RecruiterJobs />} />
          <Route path="applications" element={<div className="p-10 font-black italic uppercase text-slate-400">Candidate Applications List</div>} />
          <Route path="profile" element={<div className="p-10 font-black italic uppercase text-slate-400">Recruiter Profile Settings</div>} />
        </Route>

        {/* 🚀 404 PAGE 
        <Route path="*" element={<h1 className="text-center mt-20 text-4xl font-black italic uppercase tracking-tighter">404 - <span className="text-red-600">Lost in Space</span></h1>} />
        */}<Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;