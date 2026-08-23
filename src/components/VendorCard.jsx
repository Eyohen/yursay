import { useNavigate } from 'react-router-dom';
import { AtSign, BadgeCheck } from 'lucide-react';
import Stars from './Stars';
import Chip from './Chip';
import TrustPill from './TrustPill';

const VendorCard = ({ vendor }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/business/${vendor.id}`)}
      className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#7ab8d4] hover:shadow-lg"
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl font-['Montserrat'] text-sm font-black text-white"
          style={{ background: vendor.gradient }}
        >
          {vendor.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-['Montserrat'] text-[15px] font-bold text-[#1e3d4e]">{vendor.name}</p>
          <p className="truncate text-xs text-[#8fa3b4]">{vendor.category}</p>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Stars rating={vendor.rating} size={14} />
          <span className="font-['Montserrat'] text-sm font-extrabold text-[#1e3d4e]">{vendor.rating}</span>
        </div>
        <TrustPill score={vendor.trustScore} />
      </div>

      <p className="mb-2 flex items-center gap-1 text-xs text-[#8fa3b4]">
        {vendor.reviewCount.toLocaleString()} reviews · {vendor.location}
      </p>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {vendor.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[#d9edf5] bg-[#f0f7fa] px-2.5 py-1 text-[11px] font-semibold text-[#305d73]">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        {vendor.verified && <Chip variant="ok" size="sm" icon={BadgeCheck}>Verified</Chip>}
        {vendor.handle && <Chip variant="acc" size="sm" icon={AtSign}>{vendor.handle}</Chip>}
      </div>
    </button>
  );
};

export default VendorCard;
