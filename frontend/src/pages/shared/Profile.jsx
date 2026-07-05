import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Phone, Mail, BadgeCheck, Camera, Sparkles, Trash2, Eye, X } from 'lucide-react';
import Card from '../../components/common/Card';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import useValidator from '../../hooks/useValidator';
import { updateProfileInfo } from '../../services/auth.service';
import { updateProfileSuccess } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
];

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const { validator, validateAll, validateField } = useValidator();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error('File size must be less than 3MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }));
    toast.success('Profile photo removed. Save changes to apply.');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const selectAvatar = (url) => {
    setFormData((prev) => ({ ...prev, avatar: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    setLoading(true);
    try {
      const data = await updateProfileInfo(formData);
      if (data.success) {
        dispatch(updateProfileSuccess(data.user));
        toast.success(data.message || 'Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Account Profile
        </h2>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your personal details and custom avatar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Summary info */}
        <Card className="flex flex-col items-center justify-center text-center p-8 lg:col-span-1">
          <div className="relative group">
            <Avatar name={user?.name} src={formData.avatar} size="xl" className="border-4 border-brand-500/20 shadow-lg" />
          </div>
          <div className="flex gap-2 mt-3 justify-center">
            {formData.avatar && (
              <button
                type="button"
                onClick={() => setIsViewerOpen(true)}
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center shadow-sm"
                title="View photo"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center shadow-sm"
              title="Change photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            {user?.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider mt-1">
            {user?.designation || 'Staff'} • {user?.department || 'Operations'}
          </p>
          <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
            <BadgeCheck className="w-4 h-4" />
            {user?.role}
          </div>
          <div className="w-full border-t border-zinc-200/50 dark:border-zinc-800/50 mt-6 pt-6 text-left space-y-3">
            <div className="flex items-center gap-3 text-xs">
              <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-zinc-600 dark:text-zinc-350 truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-zinc-600 dark:text-zinc-350">{user?.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-zinc-400 dark:text-zinc-500 shrink-0 uppercase tracking-widest text-[9px]">Employee Code</span>
              <span className="text-zinc-700 dark:text-zinc-300 font-mono font-bold">{user?.employeeCode}</span>
            </div>
          </div>
        </Card>

        {/* Right Card: Editor form */}
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-zinc-300/20 dark:border-zinc-800/20 pb-4">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Profile Information</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                htmlFor="name"
                required
                error={validator.message('name', formData.name, 'required|min:2')}
              >
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  icon={User}
                />
              </FormField>

              <FormField
                label="Phone Number"
                htmlFor="phone"
                error={validator.message('phone', formData.phone, 'phone')}
              >
                <Input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  icon={Phone}
                />
              </FormField>
            </div>

            {/* Avatar Selection Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Choose Avatar Icon
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {PRESET_AVATARS.map((url, idx) => {
                  const isSelected = formData.avatar === url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectAvatar(url)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all p-0.5 ${isSelected
                        ? 'border-brand-500 ring-2 ring-brand-500/20 scale-95'
                        : 'border-zinc-300 dark:border-zinc-800 hover:scale-105'
                        }`}
                    >
                      <img src={url} alt={`Avatar Preset ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Upload Profile Photo"
                  htmlFor="profilePhotoUpload"
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 relative group">
                      <Avatar
                        name={formData.name || user?.name}
                        src={formData.avatar}
                        size="md"
                        className="border border-zinc-200 dark:border-zinc-800 shadow-sm"
                      />
                      {formData.avatar && (
                        <button
                          type="button"
                          onClick={() => setIsViewerOpen(true)}
                          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                          title="View photo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="file"
                        id="profilePhotoUpload"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-1.5 border-dashed border-2 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-950/40"
                      >
                        <Camera className="w-4.5 h-4.5 text-zinc-500" />
                        Choose Local Image
                      </Button>
                      {formData.avatar && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDeletePhoto}
                          className="text-rose-500 hover:text-rose-650 hover:bg-rose-500/5 border-rose-250/50 dark:border-rose-900/30 flex items-center gap-1.5 justify-center py-3.5 px-4"
                          title="Remove profile photo"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </FormField>

                <FormField
                  label="Or Custom Avatar Image URL"
                  htmlFor="avatarUrl"
                >
                  <Input
                    type="url"
                    name="avatar"
                    id="avatarUrl"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar}
                    onChange={handleInputChange}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <Button type="submit" variant="primary" loading={loading}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Profile Photo Lightbox Viewer Modal */}
      {isViewerOpen && formData.avatar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in" onClick={() => setIsViewerOpen(false)}>
          <div className="relative max-w-lg w-full p-4 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsViewerOpen(false)}
              className="absolute -top-12 right-4 text-white hover:text-zinc-300 bg-white/10 p-2.5 rounded-full backdrop-blur-sm transition-colors border border-white/10"
              title="Close view"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-zinc-900/40 p-2 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-lg">
              <img
                src={formData.avatar}
                alt="Profile Photo Full View"
                className="max-h-[65vh] max-w-full rounded-2xl object-contain"
              />
            </div>
            <p className="text-white/60 text-[10px] mt-4 font-bold tracking-widest uppercase">Profile Photo Full View</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
