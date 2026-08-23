// Mirrors .chip / .chip-{variant} / .chip-{size} from yursay-premium-fixed.html
const VARIANTS = {
  ok: 'bg-[#16a34a]/[0.09] text-[#15803d] border-[#16a34a]/20',
  primary: 'bg-[#305d73]/[0.09] text-[#305d73] border-[#305d73]/20',
  acc: 'bg-[#c1ff72]/[0.18] text-[#3a5c00] border-[#a0e050]/35',
  err: 'bg-[#dc2626]/10 text-[#b91c1c] border-[#dc2626]/20',
  warn: 'bg-[#d97706]/10 text-[#92400e] border-[#d97706]/25',
  dark: 'bg-[#1e3d4e] text-[#c1ff72] border-transparent',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-[10px]',
  default: 'px-2.5 py-1 text-[11px]',
  lg: 'px-3.5 py-1.5 text-[12px]',
};

const Chip = ({ variant = 'primary', size = 'default', icon: Icon, className = '', children }) => (
  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-['Montserrat'] font-bold ${VARIANTS[variant]} ${SIZES[size]} ${className}`}>
    {Icon && <Icon size={size === 'lg' ? 13 : 11} />}
    {children}
  </span>
);

export default Chip;
