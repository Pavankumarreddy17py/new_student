import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id.trim() || !password) {
      toast.error('Please enter your student ID and password');
      return;
    }
    
    try {
      setLoading(true);
      await login(id, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 fade-in">
      <div className="card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Student Academic Results Portal</h1>
          <h2 className="text-xl font-semibold text-secondary">Login</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId" className="form-label">Student ID</label>
            <input
              type="text"
              id="studentId"
              className="form-input"
              placeholder="Enter your student ID (e.g., 28BC1A0500)"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="mt-8">
            <button 
              type="submit" 
              className="btn btn-primary w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  <LogIn size={20} className="mr-2" />
                  Login
                </>
              )}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;