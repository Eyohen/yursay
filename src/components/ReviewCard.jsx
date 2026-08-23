import { useState } from 'react';
import { BadgeCheck, MapPin, ClipboardList, Package, Check, TriangleAlert, ThumbsUp, Flag, Store, Image as ImageIcon } from 'lucide-react';
import Stars from './Stars';
import Chip from './Chip';
import { markReviewHelpful, flagReview } from '../lib/vendors';

const OrderedVsGot = ({ ovg }) => (
  <div className="mt-3.5">
    <div className="grid grid-cols-[1fr_40px_1fr] items-stretch overflow-hidden rounded-2xl shadow-sm">
      <div className="bg-[#1e3d4e] p-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[1.6px] text-white/40"><ClipboardList size={13} /> What I Ordered</p>
        <div className="mb-2.5 flex h-[84px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 text-white/30">
          {ovg.orderedPhotoUrl ? <img src={ovg.orderedPhotoUrl} alt="What was ordered" className="h-full w-full object-cover" /> : <ImageIcon size={22} />}
        </div>
        {ovg.orderedLabel && <p className="text-xs leading-relaxed text-white/60">{ovg.orderedLabel}</p>}
      </div>
      <div className="relative flex items-center justify-center bg-[#1e3d4e]">
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
        <span className={`relative z-10 grid h-8 w-8 place-items-center rounded-full text-white shadow-[0_0_0_5px_#1e3d4e] ${ovg.match ? 'bg-[#c1ff72] text-[#1e3d4e]' : 'bg-[#d97706]'}`}>
          {ovg.match ? <Check size={16} /> : <TriangleAlert size={15} />}
        </span>
      </div>
      <div className="bg-gradient-to-br from-[#264d61] to-[#1e3d4e] p-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[1.6px] text-[#c1ff72]"><Package size={13} /> What I Got</p>
        <div className="mb-2.5 flex h-[84px] items-center justify-center overflow-hidden rounded-xl border border-[#c1ff72]/20 bg-[#c1ff72]/[0.07] text-white/30">
          {ovg.gotPhotoUrl ? <img src={ovg.gotPhotoUrl} alt="What was received" className="h-full w-full object-cover" /> : <ImageIcon size={22} />}
        </div>
        {ovg.gotLabel && <p className="text-xs leading-relaxed text-white/60">{ovg.gotLabel}</p>}
      </div>
    </div>
    <div className="mt-2.5">
      <Chip variant={ovg.match ? 'ok' : 'warn'} size="sm" icon={ovg.match ? BadgeCheck : TriangleAlert}>
        {ovg.match ? 'Verified Match' : 'Difference Noted'}
      </Chip>
    </div>
  </div>
);

const ReviewCard = ({ review, className = '' }) => {
  const [helpful, setHelpful] = useState(review.helpful);
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  const [flagState, setFlagState] = useState('idle'); // idle | sending | sent

  const handleHelpful = async () => {
    if (helpfulClicked) return;
    setHelpfulClicked(true);
    setHelpful((n) => n + 1);
    try {
      await markReviewHelpful(review.id);
    } catch {
      setHelpful((n) => n - 1);
      setHelpfulClicked(false);
    }
  };

  const handleFlag = async () => {
    if (flagState !== 'idle') return;
    setFlagState('sending');
    try {
      await flagReview(review.id, 'Flagged by a reader as potentially inaccurate or fake.');
      setFlagState('sent');
    } catch {
      setFlagState('idle');
    }
  };

  return (
    <div className={`rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}>
      <div className="mb-2.5 flex items-start gap-3">
        <span className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-full font-['Montserrat'] text-[15px] font-extrabold text-white ${review.avatarClass}`}>
          {review.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 font-['Montserrat'] text-[14px] font-bold text-[#1e3d4e]">
            {review.name}
            {review.verified && <Chip variant="ok" size="sm" icon={BadgeCheck} />}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#8fa3b4]">
            {review.location && <><MapPin size={11} /> {review.location} · </>}{review.date}
          </p>
        </div>
        <Stars rating={review.rating} size={14} />
      </div>

      <p className="my-2.5 text-[14px] leading-[1.75] text-[#111827]">&quot;{review.body}&quot;</p>

      <div className="flex flex-wrap gap-1.5">
        {review.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[#305d73]/[0.13] bg-[#305d73]/[0.06] px-2.5 py-1 text-[11px] font-semibold text-[#305d73]">{tag}</span>
        ))}
      </div>

      {review.ovg && <OrderedVsGot ovg={review.ovg} />}

      <div className="mt-4 flex items-center gap-4 border-t border-[#dde8ef] pt-4">
        <button
          type="button"
          onClick={handleHelpful}
          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${helpfulClicked ? 'text-[#305d73]' : 'text-[#8fa3b4] hover:bg-[#f0f7fa] hover:text-[#305d73]'}`}
        >
          <ThumbsUp size={13} /> {helpful} Helpful
        </button>
        <button
          type="button"
          onClick={handleFlag}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#8fa3b4] transition-colors hover:bg-[#f0f7fa] hover:text-[#305d73]"
        >
          <Flag size={13} /> {flagState === 'sent' ? 'Reported' : 'Report'}
        </button>
      </div>

      {review.reply && (
        <div className="mt-3.5 rounded-r-lg border-l-[3px] border-[#4a7d96] bg-[#305d73]/[0.045] px-4 py-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#305d73]"><Store size={13} /> Response from {review.reply.owner}</p>
          <p className="text-[13px] leading-relaxed text-[#4b6175]">{review.reply.text}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
