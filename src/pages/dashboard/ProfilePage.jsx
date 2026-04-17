import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user, profile, refreshProfile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    refreshProfile().catch(() => {
      // The provider already holds the latest profile when available.
    });
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const isBusiness = user?.accountType === 'business';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    setIsSaving(true);

    try {
      await updateProfile(formData);
      setStatus('Profile updated successfully.');
    } catch (submitError) {
      setError(submitError.message || 'Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = isBusiness
    ? formData.businessName || 'Business profile'
    : formData.displayName || [formData.firstName, formData.lastName].filter(Boolean).join(' ') || 'Personal profile';

  const subtitle = isBusiness
    ? formData.contactName || 'Primary contact'
    : formData.headline || 'Tell people what you do';

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isBusiness ? 'My Business Profile' : 'My Personal Profile'}
        </h1>
        <p className="text-gray-500 mt-1">
          Manage how your {isBusiness ? 'business' : 'personal'} profile appears on Connectin.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-accent to-accent-dark" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10">
            <div className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-sm flex items-center justify-center text-accent text-2xl font-bold">
              {(displayName || 'CN')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join('')}
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              <p className="text-xs text-gray-400 mt-2">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Core Details</h3>

            {isBusiness ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business name</label>
                  <input name="businessName" value={formData.businessName || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact name</label>
                  <input name="contactName" value={formData.contactName || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input name="industry" value={formData.industry || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business type</label>
                  <select name="businessType" value={formData.businessType || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                    <option value="">Select business type</option>
                    <option value="startup">Startup</option>
                    <option value="sme">SME</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="agency">Agency</option>
                    <option value="nonprofit">Nonprofit</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={5} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input name="firstName" value={formData.firstName || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input name="lastName" value={formData.lastName || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
                  <input name="displayName" value={formData.displayName || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                  <input name="headline" value={formData.headline || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows={5} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Contact</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input name="website" value={formData.website || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input name="country" value={formData.country || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input name="state" value={formData.state || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input name="city" value={formData.city || ''} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea name="address" value={formData.address || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
                {error}
              </div>
            ) : null}
            {status ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 mb-4">
                {status}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full px-4 py-3 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-dark disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
