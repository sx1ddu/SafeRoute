import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import AdminDashboard from './pages/AdminDashboard';
import ParentView from './pages/ParentView';
import DriverView from './pages/DriverView';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Settings from './pages/Settings'; 
import UsersList from './pages/UsersList';
import AddBus from './pages/AddBus'; 
import { useAuth } from './context/useAuth';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth(); // Loading state check karna zaroori hai
  const location = useLocation();
  
  const token = localStorage.getItem('token');
  const storedRole = localStorage.getItem('userRole');
  
  const currentUserRole = user?.role || storedRole;

  // Jab tak auth check ho raha hai, tab tak rukna chahiye (takki redirect loop na bane)
  if (loading) return <div>Loading...</div>;

  if (!token) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  if (allowedRole === 'all') return children;

  // Logic Fix: Agar role match nahi hai aur role available hai, tabhi redirect karo
  if (currentUserRole && currentUserRole !== allowedRole) {
    return <Navigate replace to={`/${currentUserRole}`} />;
  }

  // Agar role abhi tak mila hi nahi (server se loading mein hai), toh login bhejo fallback ke liye
  if (!currentUserRole) {
    return <Navigate replace to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- 1. ADMIN ZONE --- */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout><AdminDashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout><UsersList /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/add-bus" element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout><AddBus /></MainLayout>
          </ProtectedRoute>
        } />

        {/* --- 2. PARENT ZONE --- */}
        <Route path="/parent" element={
          <ProtectedRoute allowedRole="parent">
            <MainLayout><ParentView /></MainLayout>
          </ProtectedRoute>
        } />

        {/* --- 3. DRIVER ZONE --- */}
        <Route path="/driver" element={
          <ProtectedRoute allowedRole="driver">
            <MainLayout><DriverView /></MainLayout>
          </ProtectedRoute>
        } />

        {/* --- COMMON ZONE --- */}
        <Route path="/settings" element={
          <ProtectedRoute allowedRole="all">
            <MainLayout><Settings /></MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Default Redirects */}
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
