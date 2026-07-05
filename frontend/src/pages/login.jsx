import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock } from 'lucide-react';
import useValidator from '../hooks/useValidator';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import FormField from '../components/common/FormField';
import Card from '../components/common/Card';
import { authStart, loginSuccess, authFailure } from '../redux/slices/authSlice';
import { loginUser } from '../services/auth.service';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { validator, validateAll, validateField } = useValidator();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    dispatch(authStart());
    try {
      const data = await loginUser(formData.email, formData.password);
      if (data.success) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        toast.success(data.message || 'Logged in successfully!');
        
        // Redirect based on role
        if (data.user.role === 'Super Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      } else {
        dispatch(authFailure(data.message));
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Invalid email or password';
      dispatch(authFailure(errMsg));
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-zinc-950 px-4 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-lg mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Welcome to LeaveFlow
          </h2>
          <p className="mt-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Sign in to manage leave balances & approvals
          </p>
        </div>

        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <FormField
              label="Email Address"
              htmlFor="email"
              required
              error={validator.message('email', formData.email, 'required|email')}
            >
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                icon={Mail}
              />
            </FormField>

            {/* Password Input */}
            <FormField
              label="Password"
              htmlFor="password"
              required
              error={validator.message('password', formData.password, 'required|min:6')}
            >
              <PasswordInput
                name="password"
                id="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </FormField>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4">
            <span className="text-xs text-zinc-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-600 hover:underline font-semibold">
                Sign Up
              </Link>
            </span>
          </div>
        </Card>

        {/* Demo Credentials Indicator */}
        <div className="p-4 rounded-xl bg-zinc-200/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
            Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-semibold text-zinc-700 dark:text-zinc-350">Super Admin</p>
              <p className="text-zinc-500 font-mono mt-0.5">admin@example.com</p>
              <p className="text-zinc-400 font-mono mt-0.5">Admin123</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-700 dark:text-zinc-350">Employee</p>
              <p className="text-zinc-500 font-mono mt-0.5">john@example.com</p>
              <p className="text-zinc-400 font-mono mt-0.5">Employee123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
