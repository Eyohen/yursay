import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Star, Camera, ClipboardList, Package, BadgeCheck, Check, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Stars from '../components/Stars';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { searchVendors, getVendor, createVendor, createReview, uploadImage, adaptVendor } from '../lib/vendors';

const STEP_LABELS = ['Find business', 'Rate', 'Tag', 'Write', 'Photos', 'Submit'];
const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
const EXPERIENCE_TAGS = ['Delivery', 'Quality', 'Authenticity', 'Communication', 'Speed', 'Value for Money', 'As Advertised', 'Would Buy Again', 'Packaging', 'Customer Service'];

const StepDots = ({ step }) => (
  <div className="mb-10 flex items-center justify-center gap-2">
    {STEP_LABELS.map((label, i) => {
      const n = i + 1;
      const done = n < step;
      const on = n === step;
      return (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`grid h-[34px] w-[34px] flex-shrink-0 place-items-center rounded-full border-2 font-['Montserrat'] text-[12px] font-bold transition-colors ${
              done ? 'border-[#16a34a] bg-[#16a34a] text-white'
                : on ? 'border-[#305d73] bg-[#305d73] text-white shadow-[0_0_0_5px_rgba(48,93,115,0.12)]'
                : 'border-[#c4d7e3] bg-white text-[#8fa3b4]'
            }`}
            aria-label={`Step ${n}: ${label}`}
          >
            {n}
          </div>
          {i < STEP_LABELS.length - 1 && <div className={`h-0.5 max-w-[72px] flex-1 ${n < step ? 'bg-[#16a34a]' : 'bg-[#c4d7e3]'}`} style={{ width: 28 }} />}
        </div>
      );
    })}
  </div>
);

const WriteReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('vendor');
  const { isAuthenticated, authLoading, user } = useAuth();

  const [step, setStep] = useState(preselected ? 2 : 1);
  const [vendorId, setVendorId] = useState(preselected || null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [bizQuery, setBizQuery] = useState('');
  const [foundVendors, setFoundVendors] = useState([]);
  const [showAddBiz, setShowAddBiz] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [addingBiz, setAddingBiz] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [orderedPhotoUrl, setOrderedPhotoUrl] = useState(null);
  const [gotPhotoUrl, setGotPhotoUrl] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [uploading, setUploading] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!vendorId) { setSelectedVendor(null); return; }
    getVendor(vendorId).then((v) => setSelectedVendor(adaptVendor(v))).catch(() => setSelectedVendor(null));
  }, [vendorId]);

  useEffect(() => {
    if (step !== 1) return undefined;
    const handle = setTimeout(() => {
      searchVendors({ q: bizQuery, limit: 8 })
        .then((res) => setFoundVendors(res.data.map(adaptVendor)))
        .catch(() => setFoundVendors([]));
    }, 250);
    return () => clearTimeout(handle);
  }, [bizQuery, step]);

  const toggleTag = (tag) => setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const canGoNext = () => {
    if (step === 1) return Boolean(vendorId);
    if (step === 2) return rating > 0;
    if (step === 3) return tags.length > 0;
    if (step === 4) return text.trim().length >= 20;
    return true;
  };

  const handleAddBusiness = async () => {
    if (!newBizName.trim()) return;
    setAddingBiz(true);
    try {
      const created = await createVendor({ name: newBizName.trim() });
      setVendorId(created.id);
      setShowAddBiz(false);
      setNewBizName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add that business — try again.');
    } finally {
      setAddingBiz(false);
    }
  };

  const handlePhotoPick = (setter, slot) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading((u) => ({ ...u, [slot]: true }));
    try {
      const url = await uploadImage(file);
      setter(url);
    } catch {
      setError('Photo upload failed — please try again.');
    } finally {
      setUploading((u) => ({ ...u, [slot]: false }));
    }
  };

  const handleExtraPhotos = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setUploading((u) => ({ ...u, extra: true }));
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setAdditionalPhotos(urls);
    } catch {
      setError('Photo upload failed — please try again.');
    } finally {
      setUploading((u) => ({ ...u, extra: false }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await createReview({
        vendorId,
        rating,
        tags,
        content: text.trim(),
        isAnonymous: anonymous,
        orderedPhotoUrl,
        gotPhotoUrl,
        additionalPhotos,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your review — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1); setVendorId(null); setSelectedVendor(null); setBizQuery(''); setRating(0); setTags([]);
    setText(''); setAnonymous(false); setOrderedPhotoUrl(null); setGotPhotoUrl(null);
    setAdditionalPhotos([]); setSubmitted(false); setError('');
  };

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-[#111827]">
        <Navbar />
        <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 pt-[66px] text-center">
          <h1 className="text-2xl font-bold text-[#1e3d4e]">Log in to write a review</h1>
          <p className="max-w-sm text-sm text-[#4b6175]">We verify reviewers to keep YurSay reviews trustworthy — log in or create a free account to continue.</p>
          <div className="flex gap-3">
            <Button variant="primary" size="lg" onClick={() => navigate('/login', { state: { from: location } })}>Log In</Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/signup')}>Sign Up</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />
      <main>
        <section className="bg-[#1e3d4e] px-4 pb-10 pt-[110px] text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-1.5 font-['Montserrat'] text-2xl font-extrabold tracking-tight">Write a Review</h1>
            <p className="text-sm text-white/55">Share your real experience — help others shop safely across Africa</p>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            {!submitted ? (
              <>
                <StepDots step={step} />

                {step === 1 && (
                  <div>
                    <h2 className="mb-1.5 text-lg font-bold text-[#1e3d4e]">Find the Business</h2>
                    <p className="mb-5 text-sm text-[#8fa3b4]">Search by name, category, or @Instagram handle</p>
                    <div className="mb-4 flex h-12 items-center gap-3 rounded-xl border border-[#dde8ef] px-4">
                      <Search size={17} className="text-[#8fa3b4]" />
                      <input
                        value={bizQuery}
                        onChange={(e) => setBizQuery(e.target.value)}
                        placeholder="e.g. Trendy Kicks NG or @trendykicksng"
                        className="flex-1 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      {foundVendors.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setVendorId(v.id)}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                            vendorId === v.id ? 'border-[#305d73] bg-[#f0f7fa]' : 'border-[#e5e7eb] hover:border-[#c4d7e3]'
                          }`}
                        >
                          <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg font-['Montserrat'] text-xs font-black text-white" style={{ background: v.gradient }}>
                            {v.initials}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-[#1e3d4e]">{v.name}</p>
                            <p className="truncate text-xs text-[#8fa3b4]">{v.category}{v.location ? ` · ${v.location}` : ''}</p>
                          </div>
                          {vendorId === v.id && <Check size={16} className="flex-shrink-0 text-[#305d73]" />}
                        </button>
                      ))}
                      {foundVendors.length === 0 && bizQuery && (
                        <p className="py-3 text-center text-sm text-[#8fa3b4]">No matches for &quot;{bizQuery}&quot;.</p>
                      )}
                    </div>
                    <div className="my-5 border-t border-dashed border-[#c4d7e3]" />
                    {showAddBiz ? (
                      <div className="rounded-xl border border-[#dde8ef] p-4">
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#305d73]">Business Name</label>
                        <div className="flex gap-2">
                          <input
                            value={newBizName}
                            onChange={(e) => setNewBizName(e.target.value)}
                            placeholder="e.g. Bisi's Fashion House"
                            className="flex-1 rounded-lg border border-[#c4d7e3] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c4d7e3]"
                          />
                          <Button variant="primary" size="sm" disabled={addingBiz || !newBizName.trim()} onClick={handleAddBusiness}>
                            {addingBiz ? 'Adding…' : 'Add'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <button onClick={() => setShowAddBiz(true)} className="text-sm font-semibold text-[#305d73] hover:underline">
                          + Business not listed? Add it here
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && selectedVendor && (
                  <div className="text-center">
                    <div className="mb-7 flex items-center gap-3 rounded-xl border border-[#dde8ef] bg-[#f0f7fa] p-3.5 text-left">
                      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg text-xs font-extrabold text-white" style={{ background: selectedVendor.gradient }}>
                        {selectedVendor.initials}
                      </span>
                      <p className="text-sm font-bold text-[#1e3d4e]">{selectedVendor.name}</p>
                    </div>
                    <h2 className="mb-1.5 text-lg font-bold text-[#1e3d4e]">How was your experience?</h2>
                    <p className="mb-5 text-sm text-[#8fa3b4]">Tap a star to set your rating</p>
                    <div className="mb-3 flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setRating(n)}
                          onMouseEnter={() => setHoverRating(n)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`${n} star${n > 1 ? 's' : ''}`}
                        >
                          <Star
                            size={38}
                            className={(hoverRating || rating) >= n ? 'fill-[#f59e0b] text-[#f59e0b]' : 'fill-transparent text-[#d9e2e7]'}
                            strokeWidth={1.5}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="min-h-[28px] font-['Montserrat'] text-lg font-extrabold text-[#4b6175]">
                      {STAR_LABELS[hoverRating || rating]}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="mb-1.5 text-lg font-bold text-[#1e3d4e]">Tag Your Experience</h2>
                    <p className="mb-5 text-sm text-[#8fa3b4]">Select all that apply — choose at least one</p>
                    <div className="flex flex-wrap gap-2">
                      {EXPERIENCE_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          aria-pressed={tags.includes(tag)}
                          className={`rounded-full border-[1.5px] px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                            tags.includes(tag) ? 'border-[#305d73] bg-[#305d73] text-white' : 'border-[#c4d7e3] text-[#4b6175] hover:border-[#4a7d96] hover:bg-[#f0f7fa] hover:text-[#305d73]'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="mb-1.5 text-lg font-bold text-[#1e3d4e]">Tell Us More</h2>
                    <p className="mb-5 text-sm text-[#8fa3b4]">Specific, detailed reviews help others make better decisions</p>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={2000}
                      placeholder="What did you order? Was it as shown? How was delivery? Would you recommend them? (minimum 20 characters)"
                      className="min-h-[160px] w-full rounded-xl border border-[#dde8ef] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#c4d7e3]"
                    />
                    <div className="mt-1.5 flex justify-between text-xs text-[#8fa3b4]">
                      <span>Be honest, specific, and helpful to other shoppers.</span>
                      <span>{text.length} / 2000</span>
                    </div>
                    <label className="mt-5 flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#dde8ef] bg-[#f0f7fa] p-3.5">
                      <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="h-4 w-4 accent-[#305d73]" />
                      <span className="text-sm text-[#4b6175]">Post anonymously (your identity is still verified internally, just hidden publicly)</span>
                    </label>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 className="mb-1.5 text-lg font-bold text-[#1e3d4e]">What I Ordered vs What I Got</h2>
                    <p className="mb-5 text-sm text-[#8fa3b4]">Optional — but this comparison makes your review 5× more trusted</p>
                    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="cursor-pointer rounded-xl border-2 border-dashed border-[#dde8ef] p-5 text-center">
                        {orderedPhotoUrl ? (
                          <img src={orderedPhotoUrl} alt="What I ordered" className="mx-auto mb-2 h-16 w-16 rounded-lg object-cover" />
                        ) : uploading.ordered ? (
                          <Loader2 size={20} className="mx-auto mb-2 animate-spin text-[#305d73]" />
                        ) : (
                          <ClipboardList size={20} className="mx-auto mb-2 text-[#8fa3b4]" />
                        )}
                        <p className="mb-1 text-xs font-bold text-[#1e3d4e]">What I Ordered</p>
                        <p className="text-xs text-[#8fa3b4]">{orderedPhotoUrl ? 'Uploaded' : 'Add a screenshot of the listing or ad'}</p>
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoPick(setOrderedPhotoUrl, 'ordered')} />
                      </label>
                      <label className="cursor-pointer rounded-xl border-2 border-dashed border-[#dde8ef] p-5 text-center">
                        {gotPhotoUrl ? (
                          <img src={gotPhotoUrl} alt="What I got" className="mx-auto mb-2 h-16 w-16 rounded-lg object-cover" />
                        ) : uploading.got ? (
                          <Loader2 size={20} className="mx-auto mb-2 animate-spin text-[#305d73]" />
                        ) : (
                          <Package size={20} className="mx-auto mb-2 text-[#8fa3b4]" />
                        )}
                        <p className="mb-1 text-xs font-bold text-[#1e3d4e]">What I Got</p>
                        <p className="text-xs text-[#8fa3b4]">{gotPhotoUrl ? 'Uploaded' : 'Add a photo of what actually arrived'}</p>
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoPick(setGotPhotoUrl, 'got')} />
                      </label>
                    </div>
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#dde8ef] p-8 text-center">
                      {uploading.extra ? <Loader2 size={26} className="animate-spin text-[#305d73]" /> : <Camera size={26} className="text-[#8fa3b4]" />}
                      <span className="text-sm font-medium text-[#4b6175]">Tap to upload additional photos</span>
                      <span className="text-xs text-[#8fa3b4]">Max 5 photos · JPG, PNG, WEBP · 10MB each</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleExtraPhotos} />
                    </label>
                    {additionalPhotos.length > 0 && (
                      <p className="mt-2 text-xs text-[#8fa3b4]">{additionalPhotos.length} additional photo(s) uploaded</p>
                    )}
                  </div>
                )}

                {step === 6 && selectedVendor && (
                  <div>
                    <h2 className="mb-1.5 text-lg font-bold text-[#1e3d4e]">Preview Your Review</h2>
                    <p className="mb-5 text-sm text-[#8fa3b4]">This is exactly how your review will appear publicly on YurSay</p>
                    <div className="mb-5 rounded-2xl border border-[#e5e7eb] p-6">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e5f4fb] text-[13px] font-extrabold text-[#305d73]">
                          {anonymous ? 'AN' : (user?.email?.[0]?.toUpperCase() || 'Y')}
                        </span>
                        <div>
                          <p className="flex items-center gap-1.5 text-sm font-extrabold text-[#1f2025]">
                            {anonymous ? 'Anonymous Reviewer' : 'You'} <BadgeCheck size={13} className="text-[#16a34a]" />
                          </p>
                          <p className="text-xs text-[#a3acb7]">Just now · reviewing {selectedVendor.name}</p>
                        </div>
                        <Stars rating={rating} size={14} className="ml-auto" />
                      </div>
                      <p className="text-sm leading-relaxed text-[#2c333b]">&quot;{text}&quot;</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tags.map((t) => <span key={t} className="rounded-full border border-[#305d73]/[0.13] bg-[#305d73]/[0.06] px-2.5 py-1 text-[11px] font-semibold text-[#305d73]">{t}</span>)}
                      </div>
                    </div>
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[#dde8ef] bg-[#f0f7fa] p-4">
                      <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[#305d73]" />
                      <span className="text-sm text-[#4b6175]">I confirm this review is based on my genuine experience and does not violate YurSay&apos;s community guidelines.</span>
                    </label>
                  </div>
                )}

                <div className="mt-10 flex items-center justify-between border-t border-[#f0f2f4] pt-6">
                  <button
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className={`text-sm font-bold text-[#4b6175] ${step === 1 ? 'invisible' : ''}`}
                  >
                    ← Back
                  </button>
                  {step < 6 ? (
                    <Button variant="primary" size="lg" disabled={!canGoNext()} onClick={() => canGoNext() && setStep((s) => s + 1)}>
                      Continue →
                    </Button>
                  ) : (
                    <Button variant="primary" size="lg" disabled={submitting} onClick={handleSubmit}>
                      {submitting ? 'Submitting…' : 'Submit Review'}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#e9f9ee] text-[#16a34a]">
                  <Check size={28} />
                </div>
                <h2 className="mb-2.5 text-2xl font-extrabold text-[#1e3d4e]">Your voice is out there!</h2>
                <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-[#4b6175]">
                  Your review helps thousands of Nigerians shop smarter and safer. Thank you for building trust in African commerce.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="primary" size="lg" onClick={() => navigate(`/business/${vendorId}`)}>View Business</Button>
                  <Button variant="outline" size="lg" onClick={resetForm}>Write Another Review</Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WriteReviewPage;
