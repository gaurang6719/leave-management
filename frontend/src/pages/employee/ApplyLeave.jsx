import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, FileText, CalendarRange, Info } from 'lucide-react';
import dayjs from 'dayjs';
import Card from '../../components/common/Card';
import FormField from '../../components/common/FormField';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import useValidator from '../../hooks/useValidator';
import { LEAVE_TYPE_OPTIONS } from '../../constants';
import { applyForLeave } from '../../services/leave.service';
import toast from 'react-hot-toast';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    days: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  const { validator, validateAll, validateField } = useValidator();

  // Automatically calculate leave days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = dayjs(formData.startDate);
      const end = dayjs(formData.endDate);
      
      if (end.isAfter(start) || end.isSame(start)) {
        const diffDays = end.diff(start, 'day') + 1;
        setFormData((prev) => ({ ...prev, days: diffDays.toString() }));
      } else {
        setFormData((prev) => ({ ...prev, days: '' }));
      }
    }
  }, [formData.startDate, formData.endDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    const numDays = parseFloat(formData.days);
    if (isNaN(numDays) || numDays <= 0) {
      toast.error('Calculated leave days must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const data = await applyForLeave({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: numDays,
        reason: formData.reason,
      });

      if (data.success) {
        toast.success(data.message || 'Leave applied successfully!');
        navigate('/employee/dashboard');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to submit leave request';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Request Leave
        </h2>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
          Submit a new leave application to portal administration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column info */}
        <div className="md:col-span-1 space-y-4">
          <Card className="p-4 bg-zinc-50 dark:bg-zinc-950/20 border-dashed border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-brand-500" />
              <h4 className="text-xs font-bold text-zinc-600 dark:text-zinc-350 uppercase tracking-wide">
                Notice
              </h4>
            </div>
            <ul className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-2 leading-relaxed">
              <li>• Double-check your start and end dates before filing the request.</li>
              <li>• Balance deduction occurs instantly upon Admin approval.</li>
              <li>• Weekend dates are included in standard days calculations.</li>
            </ul>
          </Card>
        </div>

        {/* Right column form */}
        <Card className="md:col-span-2 p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
            <CalendarRange className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Leave Form
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              label="Leave Type"
              htmlFor="leaveType"
              required
              error={validator.message('leaveType', formData.leaveType, 'required')}
            >
              <Select
                name="leaveType"
                id="leaveType"
                options={LEAVE_TYPE_OPTIONS}
                value={formData.leaveType}
                onChange={handleInputChange}
                placeholder="Select Leave Type"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                htmlFor="startDate"
                required
                error={validator.message('startDate', formData.startDate, 'required')}
              >
                <Input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={dayjs().format('YYYY-MM-DD')}
                />
              </FormField>

              <FormField
                label="End Date"
                htmlFor="endDate"
                required
                error={validator.message('endDate', formData.endDate, 'required')}
              >
                <Input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || dayjs().format('YYYY-MM-DD')}
                />
              </FormField>
            </div>

            <FormField
              label="Calculated Leave Days"
              htmlFor="days"
              required
              error={validator.message('days', formData.days, 'required')}
            >
              <Input
                type="number"
                name="days"
                id="days"
                placeholder="Calculated days duration"
                value={formData.days}
                onChange={handleInputChange}
                disabled
              />
            </FormField>

            <FormField
              label="Reason for Leave"
              htmlFor="reason"
              required
              error={validator.message('reason', formData.reason, 'required|min:5|max:500')}
            >
              <Textarea
                name="reason"
                id="reason"
                placeholder="Specify the reason for leave request"
                value={formData.reason}
                onChange={handleInputChange}
                rows={3}
              />
            </FormField>

            <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <Button variant="outline" onClick={() => navigate('/employee/dashboard')} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading} icon={Send}>
                Submit Request
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ApplyLeave;
