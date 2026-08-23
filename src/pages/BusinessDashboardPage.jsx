import { useEffect, useState } from 'react';
import {
  BarChart3, MessageCircle, TrendingUp, Store, Star, Zap, ShieldCheck, Eye,
  Search, Phone, Camera, Save, Check, X, BadgeCheck, Lock,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Chip from '../components/Chip';
import { useAuth } from '../context/AuthContext';
import {
  getMyVendor, getVendorReviews, adaptVendor, adaptReview,
  respondToReview, claimVendor, searchVendors, updateVendor,
} from '../lib/vendors';

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'inbox', label: 'Reviews Inbox', icon: MessageCircle },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'profile', label: 'Edit Profile', icon: Store },
  { id: 'upgrade', label: 'Upgrade Plan', icon: Star },
];

const StatCard = ({ icon: Icon, num, label, trend, numColor = '#1e3d4e' }) => (
  <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-all hover:border-[#c4d7e3] hover:shadow-md">
    <Icon size={24} className="mb-3 text-[#305d73]" />
    <div className="mb-0.5 font-['Montserrat'] text-[28px] font-black leading-none" style={{ color: numColor }}>{num}</div>
    <div className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#8fa3b4]">{label}</div>
    {trend && <div className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#16a34a]"><TrendingUp size={12} /> {trend}</div>}
  </div>
);

const MiniBarChart = ({ heights, height = 72 }) => (
  <div className="flex items-end gap-1" style={{ height }}>
    {heights.map((h, i) => (
      <div key={i} className="min-w-0 flex-1 rounded-t-[3px] bg-[#7ab8d4] opacity-50 transition-all hover:bg-[#7cc92a] hover:opacity-100" style={{ height: `${h}%` }} />
    ))}
  </div>
);

const RatingBars = ({ rows }) => (
  <div>
    {rows.map((r) => (
      <div key={r.label} className="mb-2 flex items-center gap-2.5 text-xs text-[#4b6175]">
        <span className="w-[90px] flex-shrink-0">{r.label}</span>
        <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-[#dde8ef]">
          <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
        </div>
        <span className="w-8 flex-shrink-0 text-right text-[#8fa3b4]">{r.pct}%</span>
      </div>
    ))}
  </div>
);

const OverviewPanel = ({ vendor, reviews, setPanel }) => (
  <div>
    <div className="mb-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      <StatCard icon={ShieldCheck} num={vendor.trustScore} label="Trust Score" numColor="#7cc92a" />
      <StatCard icon={Star} num={vendor.rating} label="Avg Rating" trend="↑ 0.2 this month" />
      <StatCard icon={MessageCircle} num={vendor.reviewCount} label="Total Reviews" />
      <StatCard icon={Eye} num="1.2k" label="Views / Month" />
    </div>

    <div className="mb-4 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-1 font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Reviews This Month</div>
      <p className="mb-4 text-xs text-[#8fa3b4]">Reviews received over the last 30 days</p>
      <MiniBarChart heights={[40, 60, 35, 80, 55, 70, 90, 65, 85, 100, 75, 62]} />
      <p className="mt-2.5 text-center text-xs text-[#8fa3b4]">Upgrade to Pro for detailed analytics, sentiment breakdowns &amp; audience insights →</p>
    </div>

    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Reviews Awaiting Response</div>
        <Chip variant="err">{reviews.filter((r) => !r.reply).length} Unanswered</Chip>
      </div>
      <div className="flex flex-col gap-3.5">
        {reviews.filter((r) => !r.reply).map((r) => (
          <div key={r.id} className="rounded-xl border border-[#e5e7eb] p-4">
            <div className="mb-1.5 flex items-center gap-2.5">
              <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-white ${r.avatarClass}`}>{r.initials}</span>
              <span className="text-sm font-bold text-[#1e3d4e]">{r.name}</span>
              <span className="text-xs text-[#8fa3b4]">{r.date}</span>
            </div>
            <p className="text-sm text-[#4b6175]">&quot;{r.body.slice(0, 90)}…&quot;</p>
          </div>
        ))}
        {reviews.every((r) => r.reply) && <p className="text-sm text-[#8fa3b4]">All caught up — every review has a reply.</p>}
      </div>
      <Button variant="outline" size="md" full className="mt-4" onClick={() => setPanel('inbox')}>View All Reviews</Button>
    </div>
  </div>
);

const InboxPanel = ({ reviews }) => {
  const [drafts, setDrafts] = useState({});
  const [sent, setSent] = useState({});
  const [publishing, setPublishing] = useState({});

  const publish = async (reviewId) => {
    const text = drafts[reviewId]?.trim();
    if (!text) return;
    setPublishing((p) => ({ ...p, [reviewId]: true }));
    try {
      await respondToReview(reviewId, text);
      setSent((s) => ({ ...s, [reviewId]: true }));
    } catch (err) {
      console.error('Failed to publish response', err);
    } finally {
      setPublishing((p) => ({ ...p, [reviewId]: false }));
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="mb-0.5 text-lg font-bold text-[#1e3d4e]">Reviews Inbox</h2>
          <p className="text-sm text-[#4b6175]">Respond publicly to your customers — replies build trust and lift your Trust Score</p>
        </div>
        <Chip variant="err">{reviews.filter((r) => !r.reply && !sent[r.id]).length} Awaiting Reply</Chip>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-3.5 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wide text-[#8fa3b4]">Show:</span>
        <select className="rounded-lg border border-[#c4d7e3] px-3 py-2 text-xs text-[#4b6175]">
          <option>All Reviews</option><option>Awaiting Reply</option><option>Replied</option>
        </select>
        <div className="flex h-[38px] min-w-[150px] flex-1 items-center gap-2 rounded-lg border border-[#c4d7e3] px-3">
          <Search size={14} className="text-[#8fa3b4]" />
          <input placeholder="Search reviews…" className="flex-1 bg-transparent text-xs focus:outline-none" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((r) => {
          const hasReply = r.reply || sent[r.id];
          return (
            <div key={r.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${!hasReply ? 'border-l-[3px] border-l-[#d97706] border-y-[#e5e7eb] border-r-[#e5e7eb]' : 'border-[#e5e7eb]'}`}>
              <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                <span className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-full text-xs font-extrabold text-white ${r.avatarClass}`}>{r.initials}</span>
                <div>
                  <div className="text-sm font-bold text-[#1e3d4e]">{r.name}</div>
                  <div className="text-xs text-[#8fa3b4]">{r.date}</div>
                </div>
                <span className="ml-auto">
                  {hasReply ? <Chip variant="ok" icon={BadgeCheck}>Replied</Chip> : <Chip variant="err">Awaiting Reply</Chip>}
                </span>
              </div>
              <p className="mb-2.5 text-sm text-[#111827]">&quot;{r.body}&quot;</p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {r.tags.map((t) => <span key={t} className="rounded-full border border-[#305d73]/[0.13] bg-[#305d73]/[0.06] px-2.5 py-1 text-[11px] font-semibold text-[#305d73]">{t}</span>)}
              </div>
              {hasReply ? (
                <div className="rounded-r-lg border-l-[3px] border-[#4a7d96] bg-[#305d73]/[0.045] px-4 py-3">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#305d73]"><Store size={13} /> Your Published Response</p>
                  <p className="text-[13px] leading-relaxed text-[#4b6175]">{r.reply?.text || drafts[r.id]}</p>
                </div>
              ) : (
                <>
                  <textarea
                    value={drafts[r.id] || ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                    placeholder="Write your public response — customers see this under the review…"
                    className="min-h-[72px] w-full rounded-xl border border-[#dde8ef] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#c4d7e3]"
                  />
                  <div className="mt-2.5 flex gap-2">
                    <Button variant="primary" size="sm" disabled={!drafts[r.id]?.trim() || publishing[r.id]} onClick={() => publish(r.id)}>
                      {publishing[r.id] ? 'Publishing…' : 'Publish Response'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AnalyticsPanel = () => (
  <div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="mb-0.5 text-lg font-bold text-[#1e3d4e]">Analytics</h2>
        <p className="text-sm text-[#4b6175]">How customers find and experience your business</p>
      </div>
      <select className="rounded-lg border border-[#c4d7e3] px-3 py-2 text-xs text-[#4b6175]">
        <option>Last 30 Days</option><option>Last 7 Days</option><option>Last 90 Days</option>
      </select>
    </div>

    <div className="mb-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      <StatCard icon={Eye} num="1,248" label="Profile Views" trend="18% vs last month" />
      <StatCard icon={Search} num="3,420" label="Search Appearances" trend="24% vs last month" />
      <StatCard icon={MessageCircle} num="32" label="New Reviews" trend="9 more than last month" />
      <StatCard icon={Phone} num="186" label="Contact Clicks" />
    </div>

    <div className="mb-4 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <div className="font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Profile Views — Last 30 Days</div>
        <Chip variant="primary" size="sm">Daily</Chip>
      </div>
      <p className="mb-4 text-xs text-[#8fa3b4]">Hover a bar to inspect a specific day</p>
      <MiniBarChart height={110} heights={[32, 45, 38, 56, 48, 62, 52, 70, 58, 76, 66, 82, 71, 88, 95, 100]} />
    </div>

    <div className="mb-4 grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-4 font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Rating Breakdown</div>
        <RatingBars rows={[
          { label: '5 stars', pct: 64, color: '#16a34a' },
          { label: '4 stars', pct: 22, color: '#6497ad' },
          { label: '3 stars', pct: 8, color: '#94a3b8' },
          { label: '2 stars', pct: 4, color: '#d97706' },
          { label: '1 star', pct: 2, color: '#dc2626' },
        ]} />
      </div>
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-4 font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Top Experience Tags</div>
        <RatingBars rows={[
          { label: 'As Advertised', pct: 86, color: '#305d73' },
          { label: 'Speed', pct: 78, color: '#305d73' },
          { label: 'Communication', pct: 71, color: '#305d73' },
          { label: 'Delivery', pct: 64, color: '#305d73' },
          { label: 'Value', pct: 52, color: '#305d73' },
        ]} />
      </div>
    </div>

    <div className="relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-4 font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Audience Insights</div>
      <div className="grid grid-cols-3 gap-3.5 opacity-45 blur-sm" aria-hidden="true">
        <div className="rounded-xl border border-[#e5e7eb] p-4 text-center"><div className="font-['Montserrat'] text-2xl font-black text-[#1e3d4e]">68%</div><div className="text-[10px] text-[#8fa3b4]">From Lagos</div></div>
        <div className="rounded-xl border border-[#e5e7eb] p-4 text-center"><div className="font-['Montserrat'] text-2xl font-black text-[#1e3d4e]">54%</div><div className="text-[10px] text-[#8fa3b4]">Via @handle Search</div></div>
        <div className="rounded-xl border border-[#e5e7eb] p-4 text-center"><div className="font-['Montserrat'] text-2xl font-black text-[#1e3d4e]">2.4×</div><div className="text-[10px] text-[#8fa3b4]">Repeat Visitors</div></div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-white/60">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1e3d4e] text-[#c1ff72]"><Lock size={18} /></span>
        <div className="font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Audience Insights is a Pro feature</div>
        <Button variant="accent" size="sm" icon={Zap}>Upgrade to Pro</Button>
      </div>
    </div>
  </div>
);

const HOURS = [
  { day: 'Mon', time: '9:00 AM – 8:00 PM', on: true }, { day: 'Tue', time: '9:00 AM – 8:00 PM', on: true },
  { day: 'Wed', time: '9:00 AM – 8:00 PM', on: true }, { day: 'Thu', time: '9:00 AM – 8:00 PM', on: true },
  { day: 'Fri', time: '9:00 AM – 9:00 PM', on: true }, { day: 'Sat', time: '10:00 AM – 9:00 PM', on: true },
  { day: 'Sun', time: 'Closed', on: false },
];

const ProfilePanel = ({ vendor, onSaved }) => {
  const [hours, setHours] = useState(HOURS);
  const [form, setForm] = useState({
    name: vendor.name,
    description: vendor.description || '',
    handle: vendor.handle || '',
    whatsapp: vendor.whatsapp || '',
    phone: vendor.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateVendor(vendor.id, {
        name: form.name,
        description: form.description,
        handle: form.handle,
        whatsapp: form.whatsapp,
        phone: form.phone,
      });
      onSaved?.(updated);
      setSaved(true);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="mb-0.5 text-lg font-bold text-[#1e3d4e]">Edit Profile</h2>
          <p className="text-sm text-[#4b6175]">Keep your public profile accurate — complete profiles earn 2× more customer contact</p>
        </div>
        <Chip variant="ok" icon={BadgeCheck}>85% Complete</Chip>
      </div>

      <div className="mb-4 rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-sm">
        <div className="mb-5 font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Business Identity</div>
        <div className="mb-5 flex flex-wrap items-center gap-5">
          <span className="grid h-20 w-20 flex-shrink-0 place-items-center rounded-2xl font-['Montserrat'] text-2xl font-black text-white" style={{ background: vendor.gradient }}>{vendor.initials}</span>
          <div>
            <Button variant="outline" size="sm" icon={Camera}>Change Logo</Button>
            <p className="mt-1.5 text-xs text-[#8fa3b4]">Square image · Min 400×400 · JPG or PNG</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#305d73]">Business Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-[#c4d7e3] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c4d7e3]" />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#305d73]">Category</label>
            <input disabled value={vendor.category} className="w-full rounded-lg border border-[#c4d7e3] bg-[#f0f7fa] px-4 py-3 text-sm text-[#8fa3b4]" />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#305d73]">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            maxLength={3000}
            className="min-h-[96px] w-full rounded-xl border border-[#c4d7e3] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#c4d7e3]"
          />
          <p className="mt-1.5 text-xs text-[#8fa3b4]">Shown at the top of your public profile</p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-sm">
        <div className="mb-5 font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Contact &amp; Location</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#305d73]">Instagram Handle</label>
            <input value={form.handle} onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))} placeholder="@yourhandle" className="w-full rounded-lg border border-[#c4d7e3] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c4d7e3]" />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#305d73]">WhatsApp Number</label>
            <input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} placeholder="+234 810 555 0134" className="w-full rounded-lg border border-[#c4d7e3] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c4d7e3]" />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#305d73]">Phone Number</label>
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full rounded-lg border border-[#c4d7e3] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c4d7e3]" />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#305d73]">City / Area</label>
            <input disabled value={vendor.location || '—'} className="w-full rounded-lg border border-[#c4d7e3] bg-[#f0f7fa] px-4 py-3 text-sm text-[#8fa3b4]" />
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">Business Hours</div>
          <button
            onClick={() => setHours((h) => h.map((d) => ({ ...d, time: h[0].time, on: h[0].on })))}
            className="text-xs font-bold text-[#305d73] hover:underline"
          >
            Copy Mon to all
          </button>
        </div>
        {hours.map((d, i) => (
          <div key={d.day} className="flex items-center gap-3 border-b border-[#f0f2f4] py-2.5 text-sm last:border-b-0">
            <span className="w-11 flex-shrink-0 font-['Montserrat'] text-xs font-bold text-[#1e3d4e]">{d.day}</span>
            <span className={`flex-1 ${d.on ? 'text-[#4b6175]' : 'text-[#8fa3b4]'}`}>{d.time}</span>
            <button
              onClick={() => setHours((h) => h.map((x, idx) => (idx === i ? { ...x, on: !x.on } : x)))}
              role="switch" aria-checked={d.on}
              className={`relative h-[22px] w-[38px] flex-shrink-0 rounded-full transition-colors ${d.on ? 'bg-[#305d73]' : 'bg-[#c4d7e3]'}`}
            >
              <span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-transform ${d.on ? 'translate-x-[19px]' : 'translate-x-[3px]'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" size="lg" icon={Save} disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Save Changes'}</Button>
        <span className="ml-auto text-xs text-[#8fa3b4]">{saved ? 'Saved just now' : 'Not saved yet'}</span>
      </div>
    </div>
  );
};

const PLANS = [
  {
    name: 'Free', desc: 'For businesses just getting started with reviews', priceMo: '₦0', priceYr: '₦0', per: 'forever',
    features: [['Claim & verify your profile', true], ['Respond to all reviews', true], ['Basic monthly analytics', true], ['Audience insights', false], ['Priority placement in search', false]],
    cta: 'Current Plan', variant: 'ghost', disabled: true,
  },
  {
    name: 'Pro', desc: 'For serious vendors building a trusted reputation', priceMo: '₦7,500', priceYr: '₦6,000', per: 'per month', featured: true,
    features: [['Everything in Free', true], ['Full analytics & audience insights', true], ['Pro Trust Badge on your profile', true], ['Priority placement in search', true], ['Review alerts via WhatsApp', true]],
    cta: 'Upgrade to Pro', variant: 'accent', icon: Zap,
  },
  {
    name: 'Business', desc: 'For multi-branch brands and growing teams', priceMo: '₦25,000', priceYr: '₦20,000', per: 'per month',
    features: [['Everything in Pro', true], ['Up to 5 branch profiles', true], ['Team seats & roles', true], ['API access & data export', true], ['Dedicated support', true]],
    cta: 'Contact Sales', variant: 'outline',
  },
];

const UpgradePanel = () => {
  const [billing, setBilling] = useState('mo');

  return (
    <div>
      <div className="mb-7 text-center">
        <h2 className="mb-1.5 text-lg font-bold text-[#1e3d4e]">Choose Your Plan</h2>
        <p className="mx-auto mb-5 max-w-md text-sm text-[#4b6175]">Grow trust, respond faster, and understand your customers — upgrade any time, cancel any time</p>
        <div className="inline-flex rounded-full border-[1.5px] border-[#c4d7e3] bg-white p-[3px]">
          {[['mo', 'Monthly'], ['yr', 'Yearly · Save 20%']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setBilling(key)}
              className={`rounded-full px-[18px] py-[7px] font-['Montserrat'] text-xs font-bold transition-colors ${billing === key ? 'bg-[#305d73] text-white' : 'text-[#4b6175]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-stretch gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border-[1.5px] p-7 transition-all hover:-translate-y-1 ${
              plan.featured ? 'border-[#1e3d4e] bg-[#1e3d4e] shadow-xl' : 'border-[#e5e7eb] bg-white hover:shadow-lg'
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#c1ff72] px-3.5 py-1 font-['Montserrat'] text-[10px] font-black uppercase tracking-wide text-[#1e3d4e]">
                Most Popular
              </span>
            )}
            <div className={`mb-1 font-['Montserrat'] text-base font-extrabold ${plan.featured ? 'text-white' : 'text-[#1e3d4e]'}`}>{plan.name}</div>
            <p className={`mb-5 text-xs leading-relaxed ${plan.featured ? 'text-white/50' : 'text-[#8fa3b4]'}`}>{plan.desc}</p>
            <div className={`font-['Montserrat'] text-[38px] font-black leading-none ${plan.featured ? 'text-[#c1ff72]' : 'text-[#1e3d4e]'}`}>
              {billing === 'mo' ? plan.priceMo : plan.priceYr}
            </div>
            <div className={`mb-5 text-xs ${plan.featured ? 'text-white/40' : 'text-[#8fa3b4]'}`}>{plan.per}{billing === 'yr' && plan.priceMo !== '₦0' ? ', billed yearly' : ''}</div>
            <div className="flex-1">
              {plan.features.map(([label, included]) => (
                <div key={label} className={`flex items-start gap-2 py-1.5 text-[13px] leading-relaxed ${plan.featured ? 'text-white/72' : 'text-[#4b6175]'} ${!included ? 'opacity-40' : ''}`}>
                  {included ? <Check size={15} className={`mt-0.5 flex-shrink-0 ${plan.featured ? 'text-[#c1ff72]' : 'text-[#7cc92a]'}`} /> : <X size={15} className="mt-0.5 flex-shrink-0 text-[#8fa3b4]" />}
                  {label}
                </div>
              ))}
            </div>
            <Button variant={plan.variant} size="md" icon={plan.icon} disabled={plan.disabled} full className="mt-5">{plan.cta}</Button>
          </div>
        ))}
      </div>
      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-[#8fa3b4]">
        <ShieldCheck size={13} /> Paying never changes your reviews — ratings and customer feedback can never be bought, edited, or removed.
      </p>
    </div>
  );
};

const ClaimSearch = ({ onClaimed }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [claimingId, setClaimingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const handle = setTimeout(() => {
      if (!query.trim()) { setResults([]); return; }
      searchVendors({ q: query, limit: 8 }).then((res) => setResults(res.data.map(adaptVendor))).catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const handleClaim = async (id) => {
    setClaimingId(id);
    setError('');
    try {
      const claimed = await claimVendor(id);
      onClaimed(claimed);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not claim that listing.');
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg text-center">
      <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#e7eef1] text-[#305d73]"><Store size={26} /></span>
      <h1 className="mb-2 text-2xl font-bold text-[#1e3d4e]">Claim your business</h1>
      <p className="mb-6 text-sm text-[#4b6175]">Find your listing below to claim it and unlock your dashboard. If it&apos;s not listed yet, write your first review and add it from there.</p>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">{error}</div>}
      <div className="mb-4 flex h-12 items-center gap-3 rounded-xl border border-[#dde8ef] px-4 text-left">
        <Search size={17} className="text-[#8fa3b4]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your business name…"
          className="flex-1 text-sm focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-2 text-left">
        {results.map((v) => (
          <div key={v.id} className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] p-3">
            <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg text-xs font-black text-white" style={{ background: v.gradient }}>{v.initials}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#1e3d4e]">{v.name}</p>
              <p className="truncate text-xs text-[#8fa3b4]">{v.category}{v.location ? ` · ${v.location}` : ''}{v.ownerUserId ? ' · Already claimed' : ''}</p>
            </div>
            <Button variant="primary" size="sm" disabled={claimingId === v.id || Boolean(v.ownerUserId)} onClick={() => handleClaim(v.id)}>
              {claimingId === v.id ? 'Claiming…' : v.ownerUserId ? 'Claimed' : 'Claim'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const BusinessDashboardPage = () => {
  const { user } = useAuth();
  const [panel, setPanel] = useState('overview');
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasClaim, setHasClaim] = useState(false);

  const loadDashboard = () => {
    setLoading(true);
    getMyVendor()
      .then((v) => {
        setVendor(adaptVendor(v));
        setHasClaim(true);
        return getVendorReviews(v.id, { limit: 50 });
      })
      .then((res) => res && setReviews(res.data.map(adaptReview)))
      .catch((err) => {
        if (err.response?.status !== 404) console.error('Failed to load business dashboard', err);
        setHasClaim(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.accountType === 'business') loadDashboard();
    else setLoading(false);
  }, [user]);

  if (user?.accountType !== 'business') {
    return (
      <div className="min-h-screen bg-white text-[#111827]">
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-[66px]">
          <div className="max-w-md text-center">
            <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#e7eef1] text-[#305d73]"><Store size={26} /></span>
            <h1 className="mb-2 text-2xl font-bold text-[#1e3d4e]">This dashboard is for business accounts</h1>
            <p className="mb-6 text-sm text-[#4b6175]">Sign up with a business account to claim your listing, respond to reviews, and track your Trust Score.</p>
            <Button variant="primary" size="lg" to="/signup">Create a Business Account</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  if (!hasClaim || !vendor) {
    return (
      <div className="min-h-screen bg-white text-[#111827]">
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-[66px]">
          <ClaimSearch onClaimed={() => loadDashboard()} />
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
          className="relative overflow-hidden pb-8 pt-[110px]"
          style={{ background: 'linear-gradient(175deg, #1e3d4e 0%, #305d73 100%)' }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_80%_at_95%_50%,rgba(193,255,114,0.06)_0,transparent_55%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-5">
              <span className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl font-['Montserrat'] text-xl font-black text-white" style={{ background: vendor.gradient }}>{vendor.initials}</span>
              <div>
                <h1 className="mb-1 font-['Montserrat'] text-2xl font-black tracking-tight text-white">{vendor.name}</h1>
                <p className="mb-2.5 text-[13px] text-white/45">Business Dashboard · Free Plan</p>
                <div className="flex flex-wrap gap-2">
                  {vendor.verified
                    ? <Chip variant="ok" size="lg" icon={BadgeCheck}>Verified Business</Chip>
                    : <Chip variant="warn" size="lg">Verification Pending</Chip>}
                  {vendor.handle && <Chip variant="acc" size="lg">{vendor.handle}</Chip>}
                </div>
              </div>
            </div>
            <Button variant="accent" size="md" icon={Zap} onClick={() => setPanel('upgrade')}>Upgrade to Pro</Button>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <div>
              <div className="mb-4 rounded-2xl border border-[#e5e7eb] bg-white p-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-[#8fa3b4]">Dashboard</p>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPanel(item.id)}
                    className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors ${
                      panel === item.id ? 'bg-[#f0f7fa] font-semibold text-[#305d73]' : 'text-[#4b6175] hover:bg-[#f0f7fa] hover:text-[#305d73]'
                    }`}
                  >
                    <item.icon size={17} className="flex-shrink-0" /> {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main */}
            <div className="min-w-0">
              {panel === 'overview' && <OverviewPanel vendor={vendor} reviews={reviews} setPanel={setPanel} />}
              {panel === 'inbox' && <InboxPanel reviews={reviews} />}
              {panel === 'analytics' && <AnalyticsPanel />}
              {panel === 'profile' && <ProfilePanel vendor={vendor} onSaved={(v) => setVendor(adaptVendor(v))} />}
              {panel === 'upgrade' && <UpgradePanel />}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessDashboardPage;
