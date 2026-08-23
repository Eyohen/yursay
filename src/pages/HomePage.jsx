import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe, Search, CircleCheck, ShieldCheck, MapPin, Sparkles, ClipboardList,
  Check, Package, PenLine, Eye, BookOpen, Handshake, RefreshCw, Store, LayoutGrid,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VendorCard from '../components/VendorCard';
import ReviewCard from '../components/ReviewCard';
import CategoryIcon from '../components/CategoryIcon';
import Eyebrow from '../components/Eyebrow';
import Button from '../components/Button';
import { searchVendors, getCategories, getRecentReviews, adaptVendor, adaptReview } from '../lib/vendors';

const heroTrust = [
  { icon: CircleCheck, num: '12,400+', label: 'Verified Reviews' },
  { icon: ShieldCheck, num: '4,800+', label: 'Businesses' },
  { icon: MapPin, num: 'Lagos · Abuja', label: '& Growing' },
];

const heroStats = [
  { n: '12.4k', l: 'Reviews Written' },
  { n: '4.8k', l: 'Businesses Listed' },
  { n: '98%', l: 'Verified Reviewers' },
  { n: '7', l: 'Cities & Growing' },
];

const socialFeatures = [
  { icon: Search, text: 'Search by @handle — not just business names' },
  { icon: ShieldCheck, text: 'See fraud alerts and trust scores before you pay' },
  { icon: Package, text: 'Delivery and authenticity scores from real buyers' },
  { icon: Sparkles, text: 'Photo proof — see what others actually received' },
];

const ovgFeatures = [
  { icon: ClipboardList, text: 'Buyers show what was advertised, right next to what arrived' },
  { icon: Check, text: 'An instant verdict — Verified Match or Difference Noted' },
  { icon: ShieldCheck, text: 'Vendors can respond, but can never remove a comparison' },
];

const howItWorks = [
  { icon: Search, title: 'Search', body: 'Find any business, vendor or Instagram handle across Africa' },
  { icon: Eye, title: 'Discover', body: 'View ratings, photos, and real customer reviews' },
  { icon: BookOpen, title: 'Read', body: 'See real experiences from verified actual buyers' },
  { icon: PenLine, title: 'Review', body: 'Post your own review with photo proof of your experience' },
  { icon: Handshake, title: 'Engage', body: 'Vendors respond publicly, building real accountability' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [handleQuery, setHandleQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ovgReview, setOvgReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      searchVendors({ sort: 'highest-rated', limit: 8 }),
      getCategories(),
      getRecentReviews({ limit: 3 }),
      getRecentReviews({ limit: 1, withPhotos: true }),
    ]).then(([vendorRes, cats, recent, withPhotos]) => {
      if (cancelled) return;
      setVendors(vendorRes.data.map(adaptVendor));
      setCategories(cats);
      setReviews(recent.map(adaptReview));
      setOvgReview(withPhotos[0] ? adaptReview(withPhotos[0]) : null);
    }).catch((err) => {
      console.error('Failed to load homepage data', err);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const runSearch = (q) => {
    const params = new URLSearchParams();
    if (q?.trim()) params.set('q', q.trim());
    navigate(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const goCategory = (id, name) => {
    setActiveCat(name);
    if (name === 'All') { navigate('/search'); return; }
    navigate(`/search?category=${id}`);
  };

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />
      <main>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#1e3d4e] pb-16 pt-[130px] text-white">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 85% 20%, rgba(193,255,114,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 50% 70% at 15% 80%, rgba(48,93,115,0.5) 0%, transparent 55%),
                radial-gradient(ellipse 40% 40% at 50% 50%, rgba(30,61,78,0.3) 0%, transparent 70%)
              `,
            }}
          />
          <div className="relative mx-auto max-w-[1284px] px-5 sm:px-8 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-[660px]"
            >
              <Eyebrow variant="white" icon={Globe} className="mb-6">Africa&apos;s #1 Review Platform</Eyebrow>
              <h1 className="mb-5 font-['Montserrat'] text-[3rem] font-black leading-[1.02] tracking-tight text-white sm:text-[3.75rem]">
                Real Reviews.<br /><em className="not-italic text-[#c1ff72]">Real Vendors.</em>
              </h1>
              <p className="mb-8 max-w-[540px] text-[16px] leading-relaxed text-white/65">
                Search any business, Instagram vendor, or service by name or @handle. Read verified reviews from real customers across Nigeria and beyond.
              </p>

              <form
                onSubmit={(e) => { e.preventDefault(); runSearch(query); }}
                className="mb-9 flex h-[58px] items-center gap-2 rounded-full border-2 border-[#c4d7e3]/30 bg-white p-1.5 pl-5 shadow-lg"
              >
                <Search size={18} className="flex-shrink-0 text-[#8fa3b4]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a business, vendor or @handle…"
                  aria-label="Search businesses, vendors or handles"
                  className="flex-1 bg-transparent text-sm text-[#111827] placeholder:text-[#b8cdd9] focus:outline-none"
                />
                <Button type="submit" variant="primary" size="md">Search</Button>
              </form>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-white/65">
                {heroTrust.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <item.icon size={14} className="text-[#c1ff72]" />
                      <strong className="font-extrabold text-white">{item.num}</strong> {item.label}
                    </span>
                    {i < heroTrust.length - 1 && <span className="h-3 w-px bg-white/15" />}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/5 sm:grid-cols-4"
            >
              {heroStats.map((s) => (
                <div key={s.l} className="bg-white/[0.025] px-6 py-5 text-center transition-colors hover:bg-white/5">
                  <div className="font-['Montserrat'] text-[30px] font-black leading-none text-[#c1ff72]">{s.n}</div>
                  <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/40">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Category strip ─────────────────────────────────────── */}
        <div className="sticky top-[66px] z-[60] border-b border-[#dde8ef] bg-white shadow-[0_2px_8px_rgba(18,50,68,0.04)]">
          <div className="mx-auto flex max-w-[1284px] gap-0.5 overflow-x-auto px-5 sm:px-8 lg:px-10">
            <button
              onClick={() => goCategory(null, 'All')}
              className={`flex flex-shrink-0 items-center gap-1.5 border-b-[2.5px] px-4 py-3.5 text-[13px] font-semibold transition-colors ${
                activeCat === 'All' ? 'border-[#305d73] text-[#305d73]' : 'border-transparent text-[#4b6175] hover:text-[#305d73]'
              }`}
            >
              <LayoutGrid size={15} /> All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => goCategory(cat.id, cat.name)}
                className={`flex flex-shrink-0 items-center gap-1.5 border-b-[2.5px] px-4 py-3.5 text-[13px] font-semibold transition-colors ${
                  activeCat === cat.name ? 'border-[#305d73] text-[#305d73]' : 'border-transparent text-[#4b6175] hover:text-[#305d73]'
                }`}
              >
                <CategoryIcon icon={cat.icon} size={15} /> {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Top rated businesses ──────────────────────────────── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <Eyebrow icon={MapPin} className="mb-2.5">Lagos, Nigeria</Eyebrow>
                <h2 className="font-['Montserrat'] text-2xl font-extrabold tracking-tight text-[#1e3d4e] sm:text-3xl">Top Rated Businesses</h2>
                <p className="mt-1.5 max-w-[380px] text-sm text-[#4b6175]">Curated from verified reviews written by real customers in your city.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/search')}>View All →</Button>
            </div>
            {!loading && vendors.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#dde8ef] p-12 text-center text-sm text-[#8fa3b4]">
                No businesses listed yet — be the first to add one from the review flow.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {vendors.map((v) => <VendorCard key={v.id} vendor={v} />)}
              </div>
            )}
          </div>
        </section>

        {/* ── Ordered vs Got ──────────────────────────────────────── */}
        {ovgReview && (
          <section className="relative overflow-hidden bg-[#1e3d4e] px-4 py-20 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_12%_15%,rgba(193,255,114,0.07)_0,transparent_60%)]" />
            <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
              <div>
                <Eyebrow variant="acc" icon={Sparkles} className="mb-4">Only on YurSay</Eyebrow>
                <h2 className="mb-4 font-['Montserrat'] text-3xl font-black leading-tight text-white sm:text-4xl">
                  What I Ordered,<br />vs What I Got.
                </h2>
                <p className="mb-8 max-w-[420px] text-[15px] leading-relaxed text-white/60">
                  Every YurSay review can include a side-by-side comparison — so before you buy, you see exactly what past customers actually received. No more guessing games with online vendors.
                </p>
                <div className="mb-9 flex flex-col gap-3.5">
                  {ovgFeatures.map((f) => (
                    <div key={f.text} className="flex items-center gap-3.5 text-sm text-white/85">
                      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.07] text-[#c1ff72]"><f.icon size={16} /></span>
                      {f.text}
                    </div>
                  ))}
                </div>
                <Button variant="accent" size="lg" onClick={() => navigate('/write-review')}>Add Yours in a Review →</Button>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-2xl">
                <ReviewCard review={ovgReview} className="border-none p-0 shadow-none hover:shadow-none" />
              </div>
            </div>
          </section>
        )}

        {/* ── Social commerce feature ───────────────────────────── */}
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#1e3d4e]">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <Eyebrow variant="white" icon={Sparkles} className="mb-5">Only on YurSay</Eyebrow>
                <h2 className="mb-3 font-['Montserrat'] text-2xl font-black tracking-tight text-white sm:text-3xl">Shopping from Instagram?</h2>
                <p className="mb-6 max-w-[440px] text-[14px] leading-[1.78] text-white/55">
                  Search any vendor by their Instagram handle (@vendorname) to instantly see verified ratings, delivery experiences, and fraud alerts. We meet you exactly where you shop.
                </p>
                <form
                  onSubmit={(e) => { e.preventDefault(); runSearch(handleQuery || '@fashionbybisi'); }}
                  className="flex h-[50px] max-w-[420px] items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.07] px-4"
                >
                  <Search size={16} className="text-white/40" />
                  <input
                    type="text"
                    value={handleQuery}
                    onChange={(e) => setHandleQuery(e.target.value)}
                    placeholder="Try: @fashionbybisi"
                    aria-label="Search by Instagram handle"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <Button type="submit" variant="accent" size="sm">Search</Button>
                </form>
              </div>
              <div className="flex flex-col justify-center gap-5 border-t border-white/5 bg-white/[0.025] p-8 sm:p-12 lg:border-l lg:border-t-0">
                {socialFeatures.map((f) => (
                  <div key={f.text} className="flex items-start gap-3.5 text-[13px] leading-relaxed text-white/72">
                    <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.07]"><f.icon size={16} /></span>
                    {f.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured reviews ──────────────────────────────────── */}
        {reviews.length > 0 && (
          <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 text-center">
                <Eyebrow icon={Sparkles} className="mb-3">Real Customer Voices</Eyebrow>
                <h2 className="font-['Montserrat'] text-2xl font-black tracking-tight text-[#1e3d4e] sm:text-3xl">What People Are Saying</h2>
                <p className="mx-auto mt-2 max-w-[480px] text-sm text-[#4b6175]">Real voices. Verified experiences. Transparent reviews that help Africa shop smarter.</p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── How it works ──────────────────────────────────────── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <Eyebrow icon={RefreshCw} className="mb-3">The Process</Eyebrow>
              <h2 className="font-['Montserrat'] text-2xl font-black tracking-tight text-[#1e3d4e] sm:text-3xl">How YurSay Works</h2>
              <p className="mx-auto mt-2 max-w-[420px] text-sm text-[#4b6175]">Five simple steps to trust-powered commerce across Africa</p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-5">
              {howItWorks.map((step, i) => (
                <div key={step.title} className="relative text-center">
                  <div className="relative z-10 mx-auto mb-3.5 grid h-11 w-11 place-items-center rounded-full bg-[#1e3d4e] font-['Montserrat'] text-[15px] font-black text-[#c1ff72]">{i + 1}</div>
                  <div className="mx-auto mb-3.5 grid h-14 w-14 place-items-center rounded-2xl border border-[#dde8ef] bg-white text-[#305d73] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"><step.icon size={24} strokeWidth={1.5} /></div>
                  <h3 className="mb-1.5 font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">{step.title}</h3>
                  <p className="mx-auto max-w-[130px] text-xs leading-relaxed text-[#4b6175]">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#c1ff72] to-[#a0e050] px-4 py-20 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute -top-16 right-[-60px] h-60 w-60 rounded-full bg-[#1e3d4e]/[0.08]" />
          <div className="pointer-events-none absolute -bottom-10 left-[10%] h-40 w-40 rounded-full bg-[#1e3d4e]/[0.06]" />
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="mb-3 font-['Montserrat'] text-2xl font-black tracking-tight text-[#1e3d4e] sm:text-3xl">Had an Experience? Tell Africa.</h2>
            <p className="mx-auto mb-9 max-w-[440px] text-[15px] leading-relaxed text-[#305d73]">
              Write a review in under 2 minutes. Help real people make real purchasing decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary" size="lg" icon={PenLine} onClick={() => navigate('/write-review')}>Write a Review</Button>
              <Button variant="outline" size="lg" icon={Store} onClick={() => navigate('/business-dashboard')}>Claim Your Business</Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
