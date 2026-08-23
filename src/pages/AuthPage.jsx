import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Eye, EyeOff, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const logo = '/yursaylogo.png';

const inputClass = 'w-full rounded-xl border border-[#dde8ef] px-4 py-3 text-sm text-[#111827] placeholder:text-[#9aa3ae] focus:outline-none focus:ring-2 focus:ring-[#c4d7e3]';
const labelClass = 'mb-1.5 block text-sm font-semibold text-[#4b6175]';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [tab, setTab] = useState(location.pathname === '/login' ? 'login' : 'signup');
  const [view, setView] = useState('form'); // 'form' | 'verify-sent' | 'forgot'
  const [accountType, setAccountType] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  const [signupForm, setSignupForm] = useState({ fullName: '', businessName: '', contactName: '', email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const destination = location.state?.from?.pathname || '/';

  const switchTab = (next) => {
    setTab(next);
    setView('form');
    setError('');
    navigate(next === 'login' ? '/login' : '/signup', { replace: true });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const payload = { accountType, email: signupForm.email, password: signupForm.password };
      if (accountType === 'personal') payload.fullName = signupForm.fullName;
      else { payload.businessName = signupForm.businessName; payload.contactName = signupForm.contactName; }

      await register(payload);
      setPendingEmail(signupForm.email);
      setView('verify-sent');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(loginForm);
      navigate(destination, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResendStatus('sending');
    try {
      await api.post('/auth/resend-verification', { email: pendingEmail });
      setResendStatus('sent');
    } catch {
      setResendStatus('error');
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-center overflow-hidden bg-[#1e3d4e] px-14 py-12 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(184,255,101,0.08)_0,transparent_45%)]" />
        <div className="relative max-w-md">
          <img src={logo} alt="YurSay" className="mb-10 h-9 w-auto" />
          <h1 className="mb-4 font-['Montserrat'] text-3xl font-extrabold leading-tight tracking-tight">
            Join Africa&apos;s Trust Revolution
          </h1>
          <p className="mb-10 text-[15px] leading-relaxed text-white/60">
            Write real reviews, discover trusted vendors, and help build a safer commerce ecosystem across Africa — starting in Nigeria.
          </p>
          <div className="rounded-2xl bg-white/8 p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#305d73] text-[13px] font-extrabold text-white">CK</span>
              <div>
                <p className="text-sm font-bold text-white">Chidi Kalu</p>
                <p className="text-[#f59e0b] text-xs">★★★★★</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#16a34a]/15 px-2 py-1 text-[10px] font-extrabold text-[#4ade80]"><BadgeCheck size={11} /> Verified</span>
            </div>
            <p className="text-[13px] leading-relaxed text-white/70">
              &quot;YurSay saved me from buying from a fraudulent vendor. The reviews were spot-on and I found a genuine seller with a 4.9 rating!&quot;
            </p>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-white/30">Join 12,000+ Nigerians already on YurSay</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 block lg:hidden">
            <img src={logo} alt="YurSay" className="h-8 w-auto" />
          </Link>

          {view === 'verify-sent' && (
            <div className="text-center">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#e7eef1] text-[#305d73]"><Mail size={26} /></div>
              <h2 className="mb-2 text-2xl font-bold text-[#1e3d4e]">Verify your account</h2>
              <p className="mb-6 text-sm text-[#4b6175]">
                We sent a verification link to <strong>{pendingEmail}</strong>. Click it to activate your account, then log in.
              </p>
              <button
                onClick={handleResend}
                disabled={resendStatus === 'sending'}
                className="mb-3 w-full rounded-xl bg-[#305d73] hover:bg-[#264d61] transition-colors py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {resendStatus === 'sending' ? 'Sending…' : resendStatus === 'sent' ? 'Verification email resent' : 'Resend verification email'}
              </button>
              <button onClick={() => switchTab('login')} className="text-sm font-semibold text-[#305d73]">Back to Log In</button>
            </div>
          )}

          {view === 'forgot' && (
            <div>
              <h2 className="mb-1 text-2xl font-bold text-[#1e3d4e]">Reset your password</h2>
              <p className="mb-6 text-sm text-[#4b6175]">Enter your email and we&apos;ll send you a reset link.</p>
              {forgotSent ? (
                <div className="rounded-xl border border-[#dde8ef] bg-[#f0f7fa] p-4 text-sm text-[#4b6175]">
                  If that email exists on YurSay, a reset link is on its way.
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
                  <div>
                    <label className={labelClass} htmlFor="forgot-email">Email address</label>
                    <input id="forgot-email" type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@email.com" className={inputClass} />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#305d73] hover:bg-[#264d61] transition-colors py-3 text-sm font-bold text-white disabled:opacity-60">
                    {isSubmitting ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </form>
              )}
              <button onClick={() => { setView('form'); setError(''); }} className="mt-5 text-sm font-semibold text-[#305d73]">← Back to Log In</button>
            </div>
          )}

          {view === 'form' && (
            <>
              <div className="mb-7 flex rounded-full bg-[#f0f7fa] p-1">
                <button
                  onClick={() => switchTab('signup')}
                  className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-colors ${tab === 'signup' ? 'bg-[#305d73] hover:bg-[#264d61] transition-colors text-white' : 'text-[#4b6175]'}`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => switchTab('login')}
                  className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-colors ${tab === 'login' ? 'bg-[#305d73] hover:bg-[#264d61] transition-colors text-white' : 'text-[#4b6175]'}`}
                >
                  Log In
                </button>
              </div>

              {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              {tab === 'signup' ? (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'personal', label: "I'm shopping" },
                      { value: 'business', label: 'I run a business' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAccountType(opt.value)}
                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
                          accountType === opt.value ? 'border-[#305d73] bg-[#f0f7fa] text-[#305d73]' : 'border-[#dde8ef] text-[#8fa3b4]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {accountType === 'personal' ? (
                    <div>
                      <label className={labelClass} htmlFor="su-name">Full Name</label>
                      <input id="su-name" required value={signupForm.fullName} onChange={(e) => setSignupForm((f) => ({ ...f, fullName: e.target.value }))} placeholder="e.g. Adaeze Nwosu" className={inputClass} autoComplete="name" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className={labelClass} htmlFor="su-biz">Business Name</label>
                        <input id="su-biz" required value={signupForm.businessName} onChange={(e) => setSignupForm((f) => ({ ...f, businessName: e.target.value }))} placeholder="e.g. Bella Glow Beauty" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="su-contact">Contact Name</label>
                        <input id="su-contact" required value={signupForm.contactName} onChange={(e) => setSignupForm((f) => ({ ...f, contactName: e.target.value }))} placeholder="e.g. Adaeze Nwosu" className={inputClass} />
                      </div>
                    </>
                  )}

                  <div>
                    <label className={labelClass} htmlFor="su-email">Email</label>
                    <input id="su-email" type="email" required value={signupForm.email} onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@email.com" className={inputClass} autoComplete="email" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="su-pw">Password</label>
                    <div className="relative">
                      <input
                        id="su-pw" type={showPassword ? 'text' : 'password'} required minLength={8}
                        value={signupForm.password} onChange={(e) => setSignupForm((f) => ({ ...f, password: e.target.value }))}
                        placeholder="Min. 8 characters" className={`${inputClass} pr-11`} autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8fa3b4]">
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#305d73] hover:bg-[#264d61] transition-colors py-3.5 text-sm font-bold text-white disabled:opacity-60">
                    {isSubmitting ? 'Creating Account…' : 'Create Account →'}
                  </button>
                  <p className="text-center text-xs text-[#8fa3b4]">
                    By signing up, you agree to our <span className="text-[#305d73]">Terms</span> and <span className="text-[#305d73]">Privacy Policy</span>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className={labelClass} htmlFor="li-email">Email</label>
                    <input id="li-email" type="email" required value={loginForm.email} onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@email.com" className={inputClass} autoComplete="email" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="li-pw">Password</label>
                    <div className="relative">
                      <input
                        id="li-pw" type={showPassword ? 'text' : 'password'} required
                        value={loginForm.password} onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                        placeholder="Your password" className={`${inputClass} pr-11`} autoComplete="current-password"
                      />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8fa3b4]">
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    <div className="mt-2 text-right">
                      <button type="button" onClick={() => { setView('forgot'); setError(''); }} className="text-sm font-semibold text-[#305d73]">Forgot Password?</button>
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#305d73] hover:bg-[#264d61] transition-colors py-3.5 text-sm font-bold text-white disabled:opacity-60">
                    {isSubmitting ? 'Signing In…' : 'Log In →'}
                  </button>
                </form>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
