import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // ✅ Axios ki jagah apna api service use karo
import { useAuth } from '../context/AuthContext';
import { Bus } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ FIXED: http://localhost:5000 ko hataya aur /auth/login use kiya
      // baseURL api.js se apne aap 'https://school-bus-tracking.onrender.com/api' utha lega
      const res = await api.post('/auth/login', {
        email,
        password
      });

      if (res.data.success) {
        const { token, user } = res.data; 

        localStorage.clear(); 

        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role); 
        localStorage.setItem('userName', user.name);

        window.dispatchEvent(new Event("storage")); 

        login({ ...user, token }); 

        setLoading(false);

        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (user.role === 'driver') {
          navigate('/driver', { replace: true }); 
        } else if (user.role === 'parent') {
          navigate('/parent', { replace: true }); 
        } else {
          navigate('/', { replace: true }); 
        }
      }
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Login fail ho gaya! Details check karein.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-6">
           <Bus size={50} color="#1e3a8a" style={{margin: '0 auto'}} />
           <h2 className="school-title">St. Xavier's</h2>
           <p style={{color: '#64748b', fontWeight: 'bold', letterSpacing: '1px'}}>TRANSPORT LOGIN</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="email" 
              required
              className="input-box" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              required
              className="input-box" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Verifying Identity..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;