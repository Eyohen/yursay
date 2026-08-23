import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { api } from '../lib/api';

const logo = '/yursaylogo.png';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing from the link.');
        return;
      }

      try {
        const response = await api.get('/auth/verify-email', {
          params: { token },
        });

        setStatus('success');
        setMessage(response.data?.message || 'Your email has been verified successfully.');
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message ||
          'We could not verify this email link. It may be invalid or expired.'
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f7fa] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl sm:p-10"
      >
        <Link to="/" className="mb-8 block">
          <img src={logo} alt="YurSay" className="h-8 w-auto" />
        </Link>

        <div className="mb-6 flex items-center gap-4">
          <div className={`grid h-14 w-14 place-items-center rounded-2xl ${
            status === 'success'
              ? 'bg-[#e9f9ee] text-[#16a34a]'
              : status === 'error'
                ? 'bg-red-100 text-red-600'
                : 'bg-[#e7eef1] text-[#305d73]'
          }`}>
            {status === 'success' ? (
              <Check size={26} />
            ) : status === 'error' ? (
              <X size={26} />
            ) : (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-current/20 border-t-current" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e3d4e]">
              {status === 'success'
                ? 'Email verified'
                : status === 'error'
                  ? 'Verification failed'
                  : 'Verifying email'}
            </h1>
            <p className="mt-1 text-[#8fa3b4]">YurSay account verification</p>
          </div>
        </div>

        <div className={`rounded-xl px-4 py-4 text-sm leading-relaxed ${
          status === 'success'
            ? 'border border-[#c8ecd4] bg-[#e9f9ee] text-[#166534]'
            : status === 'error'
              ? 'border border-red-100 bg-red-50 text-red-800'
              : 'border border-[#dde8ef] bg-[#f0f7fa] text-[#4b6175]'
        }`}>
          {message}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[#305d73] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#264d61]"
          >
            Go to Log In
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-xl border border-[#dde8ef] px-5 py-3 text-sm font-bold text-[#4b6175] transition-colors hover:bg-[#f0f7fa]"
          >
            Back to Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
