import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, User, Shield, Phone, Building2, Briefcase, Lock } from 'lucide-react';
import useValidator from '../hooks/useValidator';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Select from '../components/common/Select';
import FormField from '../components/common/FormField';
import Card from '../components/common/Card';
import { authStart, loginSuccess, authFailure, logoutSuccess } from '../redux/slices/authSlice';
import { registerUser } from '../services/auth.service';
import { DEPARTMENTS } from '../constants';
import toast from 'react-hot-toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeCode: '',
    role: '',
    department: '',
    designation: '',
    phone: '',
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
      const data = await registerUser(formData);
      if (data.success) {
        dispatch(logoutSuccess());
        toast.success(data.message || 'Registration successful! Please login.');
        navigate('/login');
      } else {
        dispatch(authFailure(data.message));
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed. Try again.';
      dispatch(authFailure(errMsg));
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-lg mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Sign up to get started as Super Admin or Employee
          </p>
        </div>

        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <FormField
                label="Full Name"
                htmlFor="name"
                required
                error={validator.message('name', formData.name, 'required|min:2')}
              >
                <Input
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  icon={User}
                />
              </FormField>

              {/* Email */}
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
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  icon={Mail}
                />
              </FormField>

              {/* Password */}
              <FormField
                label="Password"
                htmlFor="password"
                required
                error={validator.message('password', formData.password, 'required|min:6')}
              >
                <PasswordInput
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
              </FormField>

              {/* Employee Code */}
              <FormField
                label="Employee Code"
                htmlFor="employeeCode"
                required
                error={validator.message('employeeCode', formData.employeeCode, 'required')}
              >
                <Input
                  name="employeeCode"
                  id="employeeCode"
                  placeholder="EMP001 or ADMIN001"
                  value={formData.employeeCode}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  icon={Shield}
                />
              </FormField>

              {/* Role Select */}
              <FormField
                label="Role Type"
                htmlFor="role"
                required
                error={validator.message('role', formData.role, 'required')}
              >
                <Select
                  name="role"
                  id="role"
                  options={['Super Admin', 'Employee']}
                  value={formData.role}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Select Role"
                />
              </FormField>

              {/* Department */}
              <FormField
                label="Department"
                htmlFor="department"
              >
                <Select
                  name="department"
                  id="department"
                  options={DEPARTMENTS}
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Select Department"
                />
              </FormField>

              {/* Designation */}
              <FormField
                label="Designation"
                htmlFor="designation"
              >
                <Input
                  name="designation"
                  id="designation"
                  placeholder="Lead Architect"
                  value={formData.designation}
                  onChange={handleInputChange}
                  icon={Briefcase}
                />
              </FormField>

              {/* Phone */}
              <FormField
                label="Phone Number"
                htmlFor="phone"
              >
                <Input
                  name="phone"
                  id="phone"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  icon={Phone}
                />
              </FormField>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              loading={loading}
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-xs text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 hover:underline font-semibold">
                Sign In
              </Link>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
