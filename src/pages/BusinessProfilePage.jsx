import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BadgeCheck, AtSign, MapPin, PenLine, Bookmark, Share2, TriangleAlert,
  CircleCheck, Zap, Clock, ShieldCheck, MessageCircle, Phone,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Stars from '../components/Stars';
import ReviewCard from '../components/ReviewCard';
import Chip from '../components/Chip';
import Button from '../components/Button';
import TrustPill from '../components/TrustPill';
import { getVendor, getVendorReviews, adaptVendor, adaptReview, saveVendor, unsaveVendor } from '../lib/vendors';

const RATING_COLORS = { 5: '#16a34a', 4: '#6497ad', 3: '#94a3b8', 2: '#d97706', 1: '#dc2626' };

const BusinessProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [vendorReviews, setVendorReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('reviews');

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    Promise.all([getVendor(id), getVendorReviews(id, { sort: 'newest', limit: 20 })])
      .then(([v, reviewsRes]) => {
        setVendor(adaptVendor(v));
        setVendorReviews(reviewsRes.data.map(adaptReview));
      })
      .catch((err) => {
        console.error('Failed to load business', err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const ratingBreakdown = useMemo(() => {
    if (!vendorReviews.length) return [];
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    vendorReviews.forEach((r) => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars, color: RATING_COLORS[stars],
      pct: Math.round((counts[stars] / vendorReviews.length) * 100),
    }));
  }, [vendorReviews]);

  const topTags = useMemo(() => {
    const freq = {};
    vendorReviews.forEach((r) => r.tags.forEach((t) => { freq[t] = (freq[t] || 0) + 1; }));
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag, count]) => ({ tag, pct: Math.round((count / vendorReviews.length) * 100) }));
  }, [vendorReviews]);

  const trustSignals = vendor ? [
    { icon: CircleCheck, label: 'Verified Reviewers', pct: vendor.trustSignals?.verifiedReviewerPct ?? 0, full: false },
    { icon: Zap, label: 'Owner Response Rate', pct: vendor.trustSignals?.ownerResponseRatePct ?? 0, full: false },
    { icon: Clock, label: 'Review Recency', pct: vendor.trustSignals?.recencyPct ?? 0, full: false },
    { icon: ShieldCheck, label: 'No Fraud Signals', pct: vendor.trustSignals?.fraudSignalsClear ? 100 : 0, full: true },
  ] : [];

  const handleSaveToggle = async () => {
    try {
      if (saved) { await unsaveVendor(id); setSaved(false); }
      else { await saveVendor(id); setSaved(true); }
    } catch (err) {
      if (err.response?.status === 401) navigate('/login', { state: { from: { pathname: `/business/${id}` } } });
    }
  };

  const handleContact = () => {
    if (vendor?.whatsapp) window.open(`https://wa.me/${vendor.whatsapp.replace(/\D/g, '')}`, '_blank');
    else if (vendor?.phone) window.location.href = `tel:${vendor.phone}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#111827]">
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center pt-[66px]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#dde8ef] border-t-[#305d73]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !vendor) {
    return (
      <div className="min-h-screen bg-white text-[#111827]">
        <Navbar />
        <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 pt-[66px] text-center">
          <h1 className="text-2xl font-bold text-[#1e3d4e]">Business not found</h1>
          <p className="max-w-sm text-sm text-[#4b6175]">This listing doesn&apos;t exist or may have been removed.</p>
          <Button variant="primary" to="/search">Back to Search</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />
      <main>
        <section
          className="relative overflow-hidden pb-0 pt-[110px]"
          style={{ background: 'linear-gradient(175deg, #1e3d4e 0%, #305d73 100%)' }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_90%_10%,rgba(193,255,114,0.06)_0,transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-7 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-end gap-5">
              <span className="grid h-[92px] w-[92px] flex-shrink-0 place-items-center rounded-2xl bg-white font-['Montserrat'] text-3xl font-black text-[#305d73] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                {vendor.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                  <h1 className="font-['Montserrat'] text-[clamp(22px,3vw,30px)] font-black tracking-tight text-white">{vendor.name}</h1>
                  {vendor.verified && <Chip variant="ok" size="lg" icon={BadgeCheck}>Verified</Chip>}
                  {vendor.handle && <Chip variant="acc" size="lg" icon={AtSign}>{vendor.handle}</Chip>}
                </div>
                <div className="flex flex-wrap items-center gap-3.5">
                  <span className="flex items-center gap-1.5 text-[13px] text-white/75">
                    <Stars rating={vendor.rating} size={14} />
                    <strong className="font-['Montserrat'] text-base font-extrabold text-white">{vendor.rating.toFixed(1)}</strong>
                    <span className="text-white/40">({vendor.reviewCount} reviews)</span>
                  </span>
                  {vendor.location && <span className="flex items-center gap-1.5 text-[13px] text-white/75"><MapPin size={13} /> {vendor.location}</span>}
                  <span className="text-[13px] text-white/75">{vendor.category}</span>
                  <TrustPill score={vendor.trustScore} />
                </div>
              </div>
            </div>
            <div className="mb-0 flex flex-wrap gap-2">
              <Button variant="accent" size="sm" icon={PenLine} onClick={() => navigate(`/write-review?vendor=${vendor.id}`)}>Write a Review</Button>
              <Button variant="darkOutline" size="sm" icon={Bookmark} onClick={handleSaveToggle}>{saved ? 'Saved' : 'Save'}</Button>
              <Button variant="darkOutline" size="sm" icon={Share2} onClick={() => navigator.clipboard?.writeText(window.location.href)}>Share</Button>
              <Button variant="darkOutline" size="sm" icon={TriangleAlert}>Report</Button>
            </div>
            <nav className="mt-6 flex gap-1 border-t border-white/10 pt-0">
              {['overview', 'reviews', 'about'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`border-b-2 px-4 py-3 text-[13px] font-bold capitalize transition-colors ${tab === t ? 'border-[#c1ff72] text-white' : 'border-transparent text-white/50 hover:text-white'}`}
                >
                  {t === 'about' ? 'About & Contact' : t}
                </button>
              ))}
            </nav>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              {/* Rating overview */}
              <div className="mb-6 flex flex-wrap items-center gap-8 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
                <div className="flex-shrink-0 text-center">
                  <div className="font-['Montserrat'] text-6xl font-black leading-none text-[#1e3d4e]">{vendor.rating.toFixed(1)}</div>
                  <Stars rating={vendor.rating} size={16} className="my-2 justify-center" />
                  <div className="text-xs text-[#8fa3b4]">{vendor.reviewCount} verified reviews</div>
                </div>
                {ratingBreakdown.length > 0 && (
                  <div className="min-w-[200px] flex-1">
                    {ratingBreakdown.map((r) => (
                      <div key={r.stars} className="mb-1.5 flex items-center gap-2 text-xs text-[#4b6175]">
                        <span className="w-3">{r.stars}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#dde8ef]">
                          <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
                        </div>
                        <span className="w-8 text-right">{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                )}
                {topTags.length > 0 && (
                  <div className="flex-shrink-0">
                    <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wide text-[#8fa3b4]">Top Experience Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {topTags.map((t) => <Chip key={t.tag} variant="primary">{t.tag} {t.pct}%</Chip>)}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {vendorReviews.length > 0 ? (
                  vendorReviews.map((r) => <ReviewCard key={r.id} review={r} />)
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#dde8ef] p-10 text-center text-sm text-[#8fa3b4]">
                    No reviews yet for {vendor.name}. Be the first to share your experience.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="mb-4 rounded-2xl bg-[#1e3d4e] p-6 text-center text-white">
                <div className="font-['Montserrat'] text-[56px] font-black leading-none text-[#c1ff72]">{vendor.trustScore}</div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[2px] text-white/35">Trust Score</div>
                <div className="my-3.5 h-px bg-white/[0.07]" />
                <div className="flex flex-col gap-3 text-left">
                  {trustSignals.map((sig) => (
                    <div key={sig.label} className="flex items-center gap-2.5">
                      <sig.icon size={14} className="flex-shrink-0 text-[#c1ff72]" />
                      <span className="min-w-0 flex-1 text-xs text-white/60">{sig.label}</span>
                      <div className="h-1 w-[72px] flex-shrink-0 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${sig.pct}%`, background: sig.full ? 'linear-gradient(90deg,#22c55e,#a0e050)' : 'linear-gradient(90deg,#4a7d96,#c1ff72)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3.5 text-[10px] font-semibold uppercase tracking-wide text-white/25">
                  {vendor.trustSignals?.fraudSignalsClear === false ? 'Suspicious activity flagged' : 'No suspicious activity detected'}
                </p>
              </div>

              <div className="mb-4 rounded-2xl border border-[#e5e7eb] bg-white p-6">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-[#1e3d4e]">Business Info</p>
                <p className="mb-3.5 text-sm leading-relaxed text-[#4b6175]">
                  {vendor.description || `${vendor.category} vendor${vendor.location ? ` operating from ${vendor.location}` : ''}.`} {vendor.verified ? 'Verified and actively monitored by YurSay.' : 'Not yet verified — reviews still visible and permanent.'}
                </p>
                <div className="flex flex-col gap-2.5 text-sm text-[#4b6175]">
                  {vendor.location && <span className="flex items-center gap-2"><MapPin size={15} /> {vendor.location}</span>}
                  {vendor.handle && <span className="flex items-center gap-2"><AtSign size={15} /> {vendor.handle} (Instagram)</span>}
                  {vendor.businessHours && <span className="flex items-center gap-2"><Clock size={15} /> {vendor.businessHours}</span>}
                  {(vendor.whatsapp || vendor.phone) && <span className="flex items-center gap-2"><MessageCircle size={15} /> {vendor.whatsapp || vendor.phone}</span>}
                </div>
                <Button variant="primary" size="md" full icon={Phone} className="mt-4" onClick={handleContact} disabled={!vendor.whatsapp && !vendor.phone}>
                  Contact Business
                </Button>
              </div>

              <div className="rounded-2xl bg-[#c1ff72] p-6 text-center">
                <PenLine size={22} className="mx-auto mb-2 text-[#1e3d4e]" />
                <p className="mb-1.5 font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Shopped here?</p>
                <p className="mb-3.5 text-xs leading-relaxed text-[#305d73]">Share your experience. Help others shop safely across Africa.</p>
                <Button variant="primary" size="sm" full onClick={() => navigate(`/write-review?vendor=${vendor.id}`)}>Write a Review</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessProfilePage;
