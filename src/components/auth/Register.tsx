import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const branches = [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate ID format
    const idPattern = /^(28|27|26|25)BC1A05[0-5][0-9]$/;
    if (!idPattern.test(id)) {
      toast.error('Please enter a valid student ID in the format YYBC1A05XX (e.g., 28BC1A0500)');
      return;
    }
    
    // Validate other inputs
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!branch) {
      toast.error('Please select your branch');
      return;
    }
    
    if (!password) {
      toast.error('Please create a password');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      await register(id, name, branch, password);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 fade-in">
      <div className="card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Student Academic Results Portal</h1>
          <h2 className="text-xl font-semibold text-secondary">Student Registration</h2>
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
            <p className="text-xs text-gray-500 mt-1">Format: YYBC1A05XX (YY=Year of joining)</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="branch" className="form-label">Branch</label>
            <select
              id="branch"
              className="form-input"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            >
              <option value="">Select your branch</option>
              {branches.map((branchOption) => (
                <option key={branchOption} value={branchOption}>
                  {branchOption}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Create Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                'Registering...'
              ) : (
                <>
                  <UserPlus size={20} className="mr-2" />
                  Register
                </>
              )}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="text-primary hover:text-primary-dark font-medium">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;