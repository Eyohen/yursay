// Mirrors .eyebrow-pill / .eyebrow-{variant}
const VARIANTS = {
  primary: 'bg-[#305d73]/[0.08] border-[#305d73]/[0.18] text-[#305d73]',
  white: 'bg-white/10 border-white/[0.18] text-white/85',
  acc: 'bg-[#c1ff72]/10 border-[#c1ff72]/25 text-[#7cc92a]',
};

const Eyebrow = ({ variant = 'primary', icon: Icon, className = '', children }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-['Montserrat'] text-[11px] font-bold uppercase tracking-[1.8px] ${VARIANTS[variant]} ${className}`}>
    {Icon && <Icon size={13} />}
    {children}
  </span>
);

export default Eyebrow;
