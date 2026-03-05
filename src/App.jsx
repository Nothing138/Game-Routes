import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import Register from './pages/Register';

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
import InboX from './pages/Admin/Inbox';
import AnnouncementMAnager from './pages/Admin/Announcement';
import ManageRecruiters from './pages/Admin/ManageRecruiters';
import JobList from './pages/Admin/JobList';
import UploadTestimony from './pages/Admin/UploadTestimony';
import FlightRequests from './pages/Admin/FlightRequests';
import FlightRevenue from './pages/Admin/FlightRevenue';

//User-Side
import BlogDetail from './pages/User-Side/BlogDetail';
import ForgotPassword from './pages/User-Side/ForgotPassword';
import Visa from './pages/User-Side/Visa';
import Job from './pages/User-Side/Job';
import Travel from './pages/User-Side/Travel';
import AboutUs from './pages/User-Side/About';
import ApplyVisa from './pages/User-Side/ApplyVisa';
import ApplyJob from './pages/User-Side/ApplyJob';
import ApplyTours from './pages/User-Side/ApplyTours';
import UserProfile from './pages/User-Side/UserProfile';
import Flight from './pages/User-Side/Flight';

// ✅ ১. Scroll To Top Logic (পেজ চেঞ্জ হলে উপরে নিয়ে যাবে)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 🌐 MAIN LAYOUT
const MainLayout = () => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
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
      {/* ২. ScrollToTop এখানে কল করতে হবে */}
      <ScrollToTop />
      
      <Routes>
        {/* 🌐 PUBLIC PAGES (সবাই দেখতে পারবে) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="visa" element={<Visa />} />
          <Route path="job" element={<Job />} />
          <Route path="travel" element={<Travel />} />
          <Route path="flight" element={<Flight />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="/apply-visa/:visaId" element={<ApplyVisa />} />
          <Route path="/apply-job/:jobId" element={<ApplyJob />} />
          <Route path="/apply-tours/:pkgId" element={<ApplyTours />} />

          {/* 🔐 USER PROTECTED ROUTES (শুধুমাত্র লগইন করা ইউজাররা দেখবে) 
          <Route element={<ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']} />}>
             
             
          </Route>*/}
        </Route>

        {/* 📊 ADMIN DASHBOARD (Protected) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['superadmin', 'admin', 'hr_manager', 'moderator', 'recruiter']}>
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
          <Route path="push-alerts" element={<AnnouncementMAnager />} />
          <Route path="manage-recruiters" element={<ManageRecruiters />} />
          <Route path="job-list" element={<JobList />} />
          <Route path="notifications" element={<InboX />} />
          <Route path="testimonials" element={<UploadTestimony />} />
          <Route path="flight-requests" element={<FlightRequests />} />
          <Route path="flight-revenue" element={<FlightRevenue />} />
        </Route>

        {/* 🚀 404 PAGE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;