import { useState } from 'react';
import { toast } from 'react-toastify';
import { createReport } from '../../services/reportService';
import { getCurrentPosition } from '../../utils/geoUtils';
import IssueTypeSelector from './IssueTypeSelector';
import PhotoUpload from './PhotoUpload';

const priorities = [
  { value: 'low', label: 'Low', color: 'text-green-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'high', label: 'High', color: 'text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'text-red-400' },
];

const ReportForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ issueType: '', description: '', priority: 'medium' });
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const getLocation = async () => {
    setLocating(true);
    try {
      const pos = await getCurrentPosition();
      setLocation({
        coordinates: [pos.coords.longitude, pos.coords.latitude],
        address: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
      });
      toast.success('📍 Location captured');
    } catch {
      toast.error('Could not get location. Please enable GPS.');
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.issueType) return toast.error('Please select an issue type');
    if (!location) return toast.error('Please capture your location first');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('issueType', form.issueType);
      fd.append('description', form.description);
      fd.append('priority', form.priority);
      fd.append('location', JSON.stringify(location));
      photos.forEach((p) => fd.append('photos', p));
      await createReport(fd);
      toast.success('✅ Report submitted successfully!');
      setForm({ issueType: '', description: '', priority: 'medium' });
      setPhotos([]);
      setLocation(null);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Issue type */}
      <div>
        <label className="input-label text-base mb-3 block">Select Issue Type *</label>
        <IssueTypeSelector value={form.issueType} onChange={(v) => setForm({ ...form, issueType: v })} />
      </div>

      {/* Description */}
      <div>
        <label className="input-label">Description *</label>
        <textarea
          className="input-field resize-none"
          rows={4}
          placeholder="Describe the issue in detail..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>

      {/* Priority */}
      <div>
        <label className="input-label">Priority Level</label>
        <div className="flex gap-2">
          {priorities.map(({ value, label, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, priority: value })}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                form.priority === value
                  ? `border-current ${color} bg-current/10`
                  : 'border-slate-600 text-slate-500 hover:border-slate-500'
              }`}
            >
              <span className={form.priority === value ? color : ''}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="input-label">Location *</label>
        <button
          type="button"
          onClick={getLocation}
          disabled={locating}
          className={`w-full py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
            location
              ? 'border-green-500 bg-green-500/10 text-green-400'
              : 'border-slate-600 text-slate-400 hover:border-orange-500 hover:text-orange-400'
          }`}
        >
          {locating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-500 border-t-orange-400 rounded-full animate-spin" />
              Getting location...
            </span>
          ) : location ? (
            `✓ ${location.address}`
          ) : (
            '📍 Capture Current Location'
          )}
        </button>
      </div>

      {/* Photos */}
      <div>
        <label className="input-label">Photos (optional, max 5)</label>
        <PhotoUpload files={photos} onChange={setPhotos} />
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-danger w-full text-base py-3">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          '🚨 Submit Alert'
        )}
      </button>
    </form>
  );
};

export default ReportForm;
