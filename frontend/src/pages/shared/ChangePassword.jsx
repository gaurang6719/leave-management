import React, { useState } from 'react';
import { KeyRound, ShieldAlert } from 'lucide-react';
import Card from '../../components/common/Card';
import FormField from '../../components/common/FormField';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import useValidator from '../../hooks/useValidator';
import SimpleReactValidator from 'simple-react-validator';
import { changeUserPassword } from '../../services/auth.service';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const { validator, validateAll, validateField, resetValidation } = useValidator({
    validators: {
      matches: {
        message: 'Passwords do not match',
        rule: (val, params) => val === params[0],
      },
    },
  });

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

    setLoading(true);
    try {
      const data = await changeUserPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (data.success) {
        toast.success(data.message || 'Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        resetValidation();
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Update Security
        </h2>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
          Regularly change your password to keep your portal secure
        </p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-2 mb-6 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
          <KeyRound className="w-5 h-5 text-brand-500" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            Change Password
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Current Password"
            htmlFor="currentPassword"
            required
            error={validator.message('currentPassword', formData.currentPassword, 'required')}
          >
            <PasswordInput
              name="currentPassword"
              id="currentPassword"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
          </FormField>

          <FormField
            label="New Password"
            htmlFor="newPassword"
            required
            error={validator.message('newPassword', formData.newPassword, 'required|min:6')}
          >
            <PasswordInput
              name="newPassword"
              id="newPassword"
              placeholder="Enter new password (min. 6 characters)"
              value={formData.newPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
          </FormField>

          <FormField
            label="Confirm New Password"
            htmlFor="confirmPassword"
            required
            error={validator.message(
              'confirmPassword',
              formData.confirmPassword,
              `required|matches:${formData.newPassword}`
            )}
          >
            <PasswordInput
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
          </FormField>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800/60 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
              <p className="font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-350">Password Policy</p>
              <p>Your password must be at least 6 characters long and should contain combinations of letters and numbers for increased safety.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <Button type="submit" variant="primary" loading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
