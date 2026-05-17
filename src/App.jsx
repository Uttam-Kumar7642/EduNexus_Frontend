import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import CompareCourses from './pages/CompareCourses';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import MyCourses from './pages/MyCourses';
import Quiz from './pages/Quiz';
import CollegeDetails from "./pages/CollegeDetails";
import Colleges from "./pages/Colleges";
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: '20vh' }} />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: '20vh' }} />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function AppLayout() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course-details/:slug" element={<CourseDetails />} />
          <Route path="/college/:id" element={<CollegeDetails />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/compare-courses" element={<CompareCourses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/quiz/:quizId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/college/:id" element={<CollegeDetails />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d2045',
            color: '#fff',
            border: '1px solid #1a3a7a',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#f59e0b', secondary: '#040d1a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#040d1a' } },
        }}
      />
    </AuthProvider>
  );
}
