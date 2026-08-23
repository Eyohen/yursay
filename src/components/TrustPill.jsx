import { ShieldCheck } from 'lucide-react';

// Mirrors .trust-pill: dark navy background, lime text
const TrustPill = ({ score, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#1e3d4e] px-2.5 py-1 font-['Montserrat'] text-[11px] font-bold text-[#c1ff72] ${className}`}>
    <ShieldCheck size={12} /> {score}
  </span>
);

export default TrustPill;
