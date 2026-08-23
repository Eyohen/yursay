import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import { api } from '../lib/api';

const logo = '/yursaylogo.png';
const inputClass = 'w-full rounded-xl border border-[#dde8ef] px-4 py-3 text-sm text-[#111827] placeholder:text-[#9aa3ae] focus:outline-none focus:ring-2 focus:ring-[#c4d7e3]';
const labelClass = 'mb-1.5 block text-sm font-semibold text-[#4b6175]';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) { setError('This reset link is missing its token.'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'This reset link is invalid or has expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f7fa] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-10"
      >
        <Link to="/" className="mb-8 block"><img src={logo} alt="YurSay" className="h-8 w-auto" /></Link>

        {success ? (
          <div className="text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#e9f9ee] text-[#16a34a]"><KeyRound size={24} /></div>
            <h1 className="mb-2 text-2xl font-bold text-[#1e3d4e]">Password reset</h1>
            <p className="mb-6 text-sm text-[#4b6175]">Your password has been updated. You can now log in with your new password.</p>
            <button onClick={() => navigate('/login')} className="w-full rounded-xl bg-[#305d73] hover:bg-[#264d61] transition-colors py-3 text-sm font-bold text-white">Go to Log In</button>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-2xl font-bold text-[#1e3d4e]">Set a new password</h1>
            <p className="mb-6 text-sm text-[#4b6175]">Choose a new password for your YurSay account.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              <div>
                <label className={labelClass} htmlFor="rp-pw">New Password</label>
                <input id="rp-pw" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" className={inputClass} autoComplete="new-password" />
              </div>
              <div>
                <label className={labelClass} htmlFor="rp-pw2">Confirm Password</label>
                <input id="rp-pw2" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" className={inputClass} autoComplete="new-password" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#305d73] hover:bg-[#264d61] transition-colors py-3 text-sm font-bold text-white disabled:opacity-60">
                {isSubmitting ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
