import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const problems = [
  {
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: 'Fraud is the baseline problem',
    body: "Millions of Nigerians have been scammed by unverified Instagram vendors, ghost restaurants, and fly-by-night services. The question isn't \"is this vendor better\" — it is \"is this vendor safe?\"",
  },
  {
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: 'No way to verify social media vendors',
    body: 'Most commerce happens through Instagram, TikTok, Facebook and WhatsApp — platforms with no trust infrastructure built in for social commerce.',
  },
  {
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: "The Gap in Africa's Review Ecosystem",
    body: 'Africa lacks a unified platform for consistent business reviews, allowing illegitimate businesses to operate undetected and mislead customers.',
  },
];

const problemIconStyles = [
  'bg-[#fff0f0] text-[#101820]',
  'bg-[#edf6f8] text-[#101820]',
  'bg-[#e9ffc2] text-[#101820]',
];

const stats = [
  { value: '700M+', label: 'Active social commerce users in Africa' },
  { value: '$56B', label: 'Lost annually to fraud in e-commerce' },
  { value: '0', label: 'Dedicated trust platforms for African vendors' },
];

const features = [
  {
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: 'Multiple Search Options',
    body: 'Search vendors by social media handles and instantly see their Trust Score, delivery rate, response rate, and rating trends. The first platform built for social commerce.',
  },
  {
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: '5-Star Ratings System',
    body: 'A fair rating breakdown with percentage bars. Delivery rate, response rate, and time on platform visible at a glance.',
  },
  {
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: 'Multimedia Proof Reviews',
    body: 'Customers upload photos showing what they actually received versus what was advertised. Visual evidence eliminates ambiguity — the most powerful anti-fraud tool available.',
  },
  {
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Trust Badge Verification',
    body: 'YurSay verification supports social story codes, business document review, and phone OTP checks so customers can see which vendors have taken trust seriously.',
  },
  {
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Vendor Analytics Dashboard',
    body: 'Sentiment analysis, topic check-ins, profile view rates, and rating trends — in one dashboard. Your reputation, quantified and actionable.',
  },
  {
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Multi-Country',
    body: 'Explore and share real opinions across different countries so you can compare experiences and make better decisions no matter where you are.',
  },
];

const steps = [
  {
    icon: (
      <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: 'Search',
    body: 'Type any vendor name, business, or @social media handle to find their YurSay profile instantly.',
  },
  {
    icon: (
      <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Discover',
    body: 'View real ratings, photos, videos, and verified reviews from actual buyers across Africa.',
  },
  {
    icon: (
      <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: 'Review',
    body: 'Post your experience with photo or video proof. Permanent. Can never be deleted by the vendor.',
  },
  {
    icon: (
      <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Trust',
    body: 'Vendors earn Trust Badges through identity verification. Buyers shop knowing who they are dealing with.',
  },
  {
    icon: (
      <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: 'Engage',
    body: 'Vendors respond publicly to reviews, building accountability and a transparent reputation record.',
  },
];

const whyMatters = [
  {
    label: 'For buyers — shop with real confidence',
    body: "No more guessing if a vendor is legitimate. Search their handle, see their verified purchase history — buy knowing exactly what other customers experienced.",
  },
  {
    label: 'For vendors — stand out from copycats and scammers',
    body: "The Trust Badge is the competitive advantage your competitors cannot clone. Outrank copycats and build the highest review counts across all top permutations.",
  },
  {
    label: 'For Africa — commerce that actually scales',
    body: "Commerce that scales beyond 100k followers or word-of-mouth alone. YurSay is the trust infrastructure that unlocks the next level of African digital commerce.",
  },
  {
    label: 'First mover advantage is real and closing fast',
    body: 'Merchants that embrace YurSay will have the highest review counts earliest. Review volume determines search ranking. The window is open today — not tomorrow.',
  },
];

const testimonials = [
  {
    quote: 'I have been scammed twice by Instagram vendors. Once for a dress that never arrived, once for electronics that were counterfeit. YurSay is the platform I have been waiting for. I would have used it before both purchases.',
    name: 'Adaeze Adeyemi',
    role: 'Online shopper · Lagos',
    initials: 'AO',
    avatarClass: 'bg-[#e7f0f4] text-[#2f6681]',
  },
  {
    quote: 'As a fashion vendor, my biggest problem is fake accounts copying my brand and scamming my customers. A verified Trust Badge that my customers can check is exactly what I need to separate myself from the fraudsters.',
    name: 'Kofi Adams',
    role: 'Fashion vendor · Accra',
    initials: 'KS',
    avatarClass: 'bg-[#fff0cc] text-[#c28720]',
  },
  {
    quote: 'We run a restaurant in Abuja and have no way to show new customers our 500 loyal regulars. YurSay gives us a permanent, professional home for our reputation. The QR code at the counter is a game-changer for us.',
    name: 'Abubakar Etang',
    role: 'Restaurant owner · Abuja',
    initials: 'MJ',
    avatarClass: 'bg-[#e3ffb3] text-[#65a91d]',
  },
];

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState({ submitted: false, error: '' });

  const submitWaitlist = (event) => {
    event.preventDefault();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailIsValid) {
      setFormState({ submitted: false, error: 'Please enter a valid email address.' });
      return;
    }
    setFormState({ submitted: true, error: '' });
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section id="home" className="relative min-h-[720px] overflow-hidden bg-[#123340] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_7%_83%,rgba(48,93,115,0.48)_0,rgba(48,93,115,0.48)_10%,transparent_10.2%)]" />
        
          <div className="absolute left-[44%] top-[42%] h-4 w-4 rounded-full bg-white" />

          <div className="absolute right-[-78px] top-[38px] hidden h-[554px] w-[554px] overflow-hidden rounded-full lg:block">
            <img
              src="/hero1.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-[59%_48%] brightness-[0.28]"
            />
            <div className="absolute inset-0 bg-[#061820]/38" />
          </div>

          <div className="relative mx-auto flex min-h-[720px] w-full max-w-[1284px] items-center px-5 pt-28 sm:px-8 lg:px-10 lg:pt-16">
            <div className="grid w-full items-center gap-12 lg:grid-cols-[0.96fr_1.04fr]">

              {/* Left - copy */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="max-w-[642px]"
              >
                <p className="mb-6 inline-flex h-8 items-center gap-2 rounded-full bg-white/20 px-3.5 pr-5 text-[11px] font-extrabold tracking-[0.02em] text-white/95 shadow-sm">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#B8FF65]" />
                  Launching in Lagos &amp; Abuja
                </p>
                <h1 className="mb-6 font-['Montserrat'] text-[2.85rem] font-extrabold leading-[0.99] tracking-tighter text-white sm:text-[4.25rem] lg:text-[4.1rem] xl:text-[4.55rem]">
                  <span className="block whitespace-nowrap">Redefining</span>
                  <span className="block whitespace-nowrap"><span className="text-[#B8FF65]">Transparency</span> in</span>
                  <span className="block whitespace-nowrap">African E-commerce</span>
                </h1>
                <p className="mb-[42px] max-w-[535px] text-[17px] font-medium leading-[1.36] text-white/62">
                  Welcome to YurSay, the trust infrastructure Africa&apos;s digital economy has been waiting for.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#waitlist"
                    className="inline-flex h-[59px] items-center justify-center gap-3 rounded-[22px] bg-[#B8FF65] px-9 text-[16px] font-extrabold text-[#123340] shadow-[0_16px_36px_rgba(184,255,101,0.18)] transition-colors hover:bg-lime-300"
                  >
                    <svg className="h-[19px] w-[19px]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Join the Waitlist
                  </a>
                  <a
                    href="#how-it-works"
                    className="inline-flex h-[59px] items-center justify-center rounded-[22px] border border-white/30 px-9 text-[16px] font-extrabold text-white transition-colors hover:bg-white/10"
                  >
                    See how it works
                  </a>
                </div>
              </motion.div>

              {/* Right - image and search UI mockup */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="relative hidden h-[430px] lg:block"
              >
                <div className="absolute left-[54px] top-[70px] h-[297px] w-[416px] rounded-[20px] bg-[#f7f9fb] p-6 text-ink shadow-[0_30px_80px_rgba(0,0,0,0.26)]">
                  <div className="mb-4 flex h-[47px] items-center gap-3 rounded-[10px] border border-[#d9e0e5] bg-white/78 px-4">
                    <svg className="h-4 w-4 flex-shrink-0 text-[#80909e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <span className="text-[13px] font-semibold text-[#a1abb6]">Search vendor or @handle...</span>
                  </div>

                  <div className="mb-[18px] flex gap-2">
                    {['All', 'Fashion', 'Food', 'Beauty'].map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex h-[30px] items-center rounded-full px-4 text-[12px] font-extrabold ${
                          tag === 'All'
                            ? 'bg-[#305d73] text-white'
                            : 'border border-[#dce2e7] bg-white text-[#596271]'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {[
                    { initials: 'LC', color: 'bg-[#e5f4fb] text-[#305d73]', name: 'LuxuryCloset.ng', sub: '@luxurycloset_ng · Fashion · Lagos', stars: 5 },
                    { initials: 'MK', color: 'bg-[#fff3cf] text-[#c78216]', name: 'MamaKitchen Abuja', sub: '@mamakitchen · Food · Abuja', stars: 4 },
                  ].map((v) => (
                    <div key={v.name} className="mb-3 flex h-[64px] items-center justify-between rounded-[10px] bg-[#eef3f7] px-3.5 last:mb-0">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`grid h-[40px] w-[40px] flex-shrink-0 place-items-center rounded-[10px] text-sm font-extrabold ${v.color}`}>
                          {v.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-extrabold leading-tight text-[#111827]">{v.name}</p>
                          <p className="mt-1 truncate text-[11px] font-medium text-[#9aa3ae]">{v.sub}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-shrink-0 flex-col items-end gap-1">
                        <span className="text-[11px] leading-none text-[#B8FF65]">
                          {'★'.repeat(v.stars)}{'☆'.repeat(5 - v.stars)}
                        </span>
                        <span className="text-[10px] font-extrabold text-success">✓ Verified</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute right-[-14px] top-8 z-10 min-w-[156px] rounded-[13px] bg-white px-4 py-3.5 text-ink shadow-[0_18px_38px_rgba(0,0,0,0.22)]">
                  <p className="mb-2 text-[10px] font-semibold text-[#a1abb6]">Trust Score</p>
                  <p className="font-display text-[23px] font-extrabold leading-none text-[#050b12]">4.8 <span className="text-[20px] text-[#050b12]">★</span></p>
                  <p className="mt-2 text-[10px] font-extrabold text-success">↑ Verified vendor</p>
                </div>

                <div className="absolute bottom-[34px] left-[-54px] z-10 w-[178px] rounded-[12px] bg-white px-4 py-3.5 text-ink shadow-[0_18px_38px_rgba(0,0,0,0.22)]">
                  <p className="mb-2 text-[9px] font-semibold text-[#a1abb6]">New review just posted</p>
                  <p className="text-[13px] font-extrabold leading-none text-[#111827]">Adaeze O. <span className="text-[11px] text-[#050b12]">★★★★★</span></p>
                  <p className="mt-3 text-[11px] font-medium text-[#9aa3ae]">&quot;Exactly as described. Legit!&quot;</p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── Problem Section ──────────────────────────────────────── */}
        <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-start">

            {/* Left — problem list */}
            <div className="space-y-5">
              {problems.map((p, index) => (
                <div key={p.title} className="flex gap-4 rounded-[15px] border border-[#e5e7eb] bg-white p-[22px] shadow-[0_2px_0_rgba(17,24,39,0.04),0_14px_32px_rgba(17,24,39,0.08)]">
                  <span className={`mt-0.5 grid h-11 w-11 flex-shrink-0 place-items-center rounded-[12px] ${problemIconStyles[index]}`}>
                    {p.icon}
                  </span>
                  <div>
                    <h3 className="mb-2 text-[16px] font-extrabold leading-tight text-[#18191f]">{p.title}</h3>
                    <p className="text-[15px] font-medium leading-[1.6] text-[#566172]">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — headline + stats */}
            <div>
              <p className="mb-5 inline-flex h-8 items-center rounded-full bg-[#E7EEF1] px-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#3d7f9f] font-['Montserrat']">
                The Problem We Solve
              </p>
              <h2 className="mb-6 font-['Montserrat'] text-xl font-extrabold leading-[1.08] tracking-tighter text-[#151515] sm:text-4xl lg:text-[2.85rem]">
                <span className="block whitespace-nowrap">Global review platforms</span>
                <span className="block whitespace-nowrap">
                  were not built for <span className="text-[#2f7895]">Africa</span>
                </span>
              </h2>
              <p className="mb-6 text-[16px] font-semibold leading-[1.7] text-[#566172]">
                Global review platforms were designed for registered businesses with physical addresses and corporate identities. The overwhelming majority of African commerce does not look like that.
              </p>
              <p className="mb-9 text-[16px] font-semibold leading-[1.7] text-[#566172]">
                It looks like a fashion vendor known only by the handle @fabstyles_ng, with no registered company, no fixed address, and thousands of loyal buyers. YurSay is built for this kind of reality.
              </p>
              <div className="grid grid-cols-3 gap-6 border-t border-[#d7dce1] pt-8">
                {stats.map((s) => (
                  <div key={s.value}>
                    <p className="font-display text-3xl font-extrabold leading-none text-[#2f7895] sm:text-[2rem]">{s.value}</p>
                    <p className="mt-3 text-[12px] font-extrabold leading-5 text-[#222831]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── Platform Features ────────────────────────────────────── */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-canvas">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <p className="text-xs font-extrabold uppercase tracking-widest text-primary mb-4 font-['Montserrat']">
                Platform Features
              </p>
              <h2 className="mb-5 font-['Montserrat'] text-3xl font-extrabold text-ink sm:text-4xl lg:text-5xl tracking-tighter">
                Everything trust needs to{' '}
                <span className="text-primary">work at scale</span>
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-ink-secondary leading-8">
                YurSay is not just a review platform. It is a complete trust infrastructure layer built for how Africans actually buy and sell.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <article key={f.title} className="bg-white rounded-xl border border-line p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary mb-5">
                    {f.icon}
                  </span>
                  <h3 className="text-lg font-extrabold text-ink mb-2">{f.title}</h3>
                  <p className="text-sm leading-6 text-ink-secondary">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-[#1E3D4E] px-4 py-24 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1120px]">
            <div className="mb-[88px] text-center">
              <p className="mb-5 inline-flex h-8 items-center rounded-full bg-white/12 px-5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#B8FF65] shadow-[0_8px_18px_rgba(0,0,0,0.18)] font-['Montserrat']">
                How It Works
              </p>
              <h2 className="font-['Montserrat'] text-3xl font-extrabold leading-[1.04] tracking-tighter sm:text-4xl lg:text-[3rem]">
                Clarity starts with{' '}
                <span className="text-[#B8FF65]">real experiences</span>
              </h2>
              <p className="mx-auto mt-5 max-w-[560px] text-[17px] font-medium leading-[1.7] text-white/55">
                Five steps. No friction. Built for the way Africans already think about buying and selling online.
              </p>
            </div>

            <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-9">
              <div className="absolute left-[9%] right-[9%] top-[43px] hidden h-[3px] bg-[#6f984e]/45 shadow-[0_0_0_1px_rgba(184,255,101,0.07)] lg:block" />
              {steps.map((s, i) => (
                <div key={s.title} className="relative z-10 flex flex-col items-center text-center">
                  <span className="mb-6 grid h-[86px] w-[86px] place-items-center rounded-full border border-[#78a978]/70 bg-[#315f72] text-[#b9cad3] shadow-[0_0_0_4px_rgba(184,255,101,0.08),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                    {s.icon}
                  </span>
                  <h3 className="mb-4 font-['Montserrat'] text-[15px] font-extrabold text-white">{s.title}</h3>
                  <p className="max-w-[188px] text-[12px] font-medium leading-[1.55] text-white/43">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-[58px] text-center">
              <a
                href="#waitlist"
                className="inline-flex h-[58px] min-w-[360px] items-center justify-center rounded-[20px] bg-[#B8FF65] px-9 font-['Montserrat'] text-[16px] font-extrabold text-[#123340] shadow-[0_8px_0_rgba(0,0,0,0.12)] transition-colors hover:bg-lime-300 max-sm:min-w-0 max-sm:w-full"
              >
                Be among the first to use YurSay →
              </a>
            </div>
          </div>
        </section>

        {/* ── Why It Matters ───────────────────────────────────────── */}
        <section id="why-yursay" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">

            {/* Left */}
            <div>
            
               <p className="mb-5 inline-flex h-8 items-center rounded-full bg-[#E7EEF1] px-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#3d7f9f] font-['Montserrat']">
              Why it Matters
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink leading-[1.15] mb-10 font-['Montserrat'] tracking-tighter">
                Trust is the product.{' '}
                <span className="text-primary">
                  If it breaks, everything breaks.
                </span>
              </h2>
              <div className="space-y-6">
                {whyMatters.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <span className="mt-1 flex-shrink-0 grid h-6 w-6 place-items-center rounded-full bg-[#1E3D4E] text-white text-xs font-extrabold">
                      ✓
                    </span>
                    <div>
                      <p className="font-extrabold text-ink mb-1">{item.label}</p>
                      <p className="text-sm leading-6 text-ink-secondary">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — dark CTA card */}
            <div className="rounded-2xl bg-primary-dark text-white p-8 flex flex-col gap-6 justify-center text-center">
              <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[#C1FF72]">
                <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </span>
              <div>
                <h3 className="text-2xl font-extrabold mb-3 font-['Montserrat'] tracking-tighter">Ready to own your reputation?</h3>
                <p className="text-white/65 leading-7 text-sm">
                  Join early community members from Nigeria and Africa who know exactly why this platform needs to exist.
                </p>
              </div>
              <a
                href="#waitlist"
                className="inline-flex w-full items-center justify-center min-h-12 rounded-3xl bg-[#C1FF72] text-primary-dark text-sm font-extrabold transition-colors hover:bg-lime-300"
              >
                Join the Waitlist Now
              </a>
              <p className="text-center text-xs text-white/40">
                ✓ Free to try &nbsp;·&nbsp; Lagos &amp; Abuja first &nbsp;·&nbsp; 54 countries next
              </p>
            </div>

          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────── */}
        <section id="community" className="bg-[#f3f6f8] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-[70px] text-center">
              <p className="mb-5 inline-flex h-8 items-center rounded-full bg-[#dce9ef] px-5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#3d7f9f] font-['Montserrat']">
                Early Community
              </p>
              <h2 className="font-display text-3xl font-extrabold leading-[1.05] text-[#1d1d22] sm:text-4xl lg:text-[3.25rem] font-['Montserrat'] tracking-tighter">
                The voices behind{' '}
                <span className="text-[#2f6681]">YurSay</span>
              </h2>
              <p className="mx-auto mt-5 max-w-[560px] text-[17px] font-medium leading-[1.7] text-[#4e5a6b]">
                Real people from across Nigeria and Africa who know exactly why this platform needs to exist.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="flex min-h-[310px] flex-col justify-between rounded-[16px] border border-[#e4e8ec] bg-white px-7 py-8 shadow-[0_1px_0_rgba(17,24,39,0.03)]">
                  <div>
                    <p className="mb-5 text-[13px] font-extrabold tracking-[0.16em] text-[#B8FF65]">★★★★★</p>
                    <p className="text-[15px] font-medium italic leading-[1.7] text-[#202127]">&quot;{t.quote}&quot;</p>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <span className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-[13px] font-extrabold ${t.avatarClass}`}>
                      {t.initials}
                    </span>
                    <div>
                      <p className="text-[14px] font-extrabold leading-tight text-[#1f2025]">{t.name}</p>
                      <p className="mt-1 text-[12px] font-medium text-[#a3acb7]">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Waitlist CTA ─────────────────────────────────────────── */}
        <section id="waitlist" className="relative overflow-hidden bg-[#1E3D4E] px-4 py-28 text-white sm:px-6 lg:px-8">
          <div className="absolute -left-24 -top-44 h-[460px] w-[460px] rounded-full bg-[#2d6375]/36" />
          <div className="absolute -right-28 bottom-[-170px] h-[440px] w-[440px] rounded-full bg-[#2b6074]/72" />

          <div className="relative mx-auto max-w-[760px] text-center">
            {/* <p className="mb-8 inline-flex h-8 items-center gap-2 rounded-full bg-white/13 px-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#B8FF65] font-['Montserrat']">
              <span className="h-[7px] w-[7px] rounded-full bg-[#B8FF65]" />
              Limited Early Access
            </p> */}
              <p className="mb-5 inline-flex h-8 items-center gap-2 rounded-full bg-white/15 px-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#B8FF65] font-['Montserrat']">
                <span className="h-[7px] w-[7px] rounded-full bg-[#B8FF65]" />
                 Limited Early Access
              </p>
            <h2 className="mb-6 font-['Montserrat'] text-[3.15rem] font-extrabold leading-[0.98] tracking-tighter text-white sm:text-[4rem]">
              Join the waitlist. <span className="text-[#B8FF65]">Be</span><br />
              <span className="text-[#B8FF65]">first.</span>
            </h2>
            <p className="mx-auto mb-14 max-w-[690px] text-[18px] font-medium leading-[1.7] text-gray-400">
              We are onboarding our first 1000 users and 100 vendors in Lagos and Abuja. Early members get free Pro access for 6 months and help shape the platform.
            </p>

            {formState.submitted ? (
              <div className="mx-auto max-w-[680px] rounded-[18px] border border-white/12 bg-white/[0.07] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
                <h3 className="text-xl font-extrabold text-[#B8FF65]">You are on the list.</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  We will share beta access updates as YurSay opens in Lagos and Abuja.
                </p>
              </div>
            ) : (
              <form onSubmit={submitWaitlist} noValidate>
                <div className="mx-auto max-w-[680px] rounded-[18px] border border-gray-500 p-9 shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="sr-only" htmlFor="waitlist-email">Email address</label>
                    <input
                      id="waitlist-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="h-[54px] flex-1 rounded-[14px] border border-[#B8FF65] bg-white px-5 text-[15px] font-medium text-[#1f2937] outline-none placeholder:text-[#9aa3ae] focus:ring-2 focus:ring-[#B8FF65]/35"
                    />
                    <button
                      type="submit"
                      className="h-[54px] rounded-full bg-[#B8FF65] px-9 text-[16px] font-extrabold text-[#123340] transition-colors hover:bg-lime-300 sm:min-w-[222px]"
                    >
                      Join the Waitlist →
                    </button>
                  </div>
                  <p className="mt-5 text-[12px] font-medium text-gray-400">
                    No spam, ever. We will email you when your spot opens.
                  </p>
                </div>
                {formState.error && (
                  <p className="mt-3 text-sm font-semibold text-red-400">{formState.error}</p>
                )}
                <div className="mt-8 flex items-center justify-center">
                  <div className="flex -space-x-2">
                    {[
                      ['AO', 'bg-[#2f6681] text-[#B8FF65]'],
                      ['KS', 'bg-[#7ca2b3] text-white'],
                      ['TN', 'bg-[#123340] text-white'],
                      ['MJ', 'bg-[#2f6681] text-white'],
                      ['+', 'bg-[#77bd1f] text-white'],
                    ].map(([label, className]) => (
                      <span key={label} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[#1f4655] text-[10px] font-extrabold ${className}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                  <p className="ml-3 text-[13px] font-medium text-gray-400">
                    <span className="font-extrabold text-[#B8FF65]">847 people</span> have already joined the waitlist
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
