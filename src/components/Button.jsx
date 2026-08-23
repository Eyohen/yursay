import { Link } from 'react-router-dom';

// Mirrors .btn / .btn-{variant} / .btn-{size} from yursay-premium-fixed.html
const VARIANTS = {
  primary: 'bg-[#305d73] text-white border-[#305d73] hover:bg-[#264d61] hover:border-[#264d61]',
  accent: 'bg-[#c1ff72] text-[#1e3d4e] border-[#c1ff72] hover:bg-[#a0e050] hover:border-[#a0e050]',
  outline: 'bg-transparent text-[#305d73] border-[#305d73] hover:bg-[#305d73] hover:text-white',
  ghost: 'bg-transparent text-[#4b6175] border-[#c4d7e3] hover:border-[#6497ad] hover:text-[#305d73] hover:bg-[#f0f7fa]',
  darkOutline: 'bg-transparent text-white/80 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40',
  danger: 'bg-transparent text-[#dc2626] border-[#dc2626]/25 hover:bg-[#dc2626]/10 hover:border-[#dc2626]',
  text: 'bg-transparent text-[#305d73] border-transparent hover:bg-[#f0f7fa] px-1',
};

// Pixel-exact px/py from .btn-{size} — using arbitrary values so an
// off-scale number (e.g. 4.5) can never silently produce no class at all.
const SIZES = {
  xs: 'px-[14px] py-[6px] text-[11px]',
  sm: 'px-[18px] py-[9px] text-[12px]',
  md: 'px-[24px] py-[11px] text-[13px]',
  lg: 'px-[32px] py-[14px] text-[14px]',
  xl: 'px-[40px] py-[17px] text-[15px]',
};

const Button = ({ variant = 'primary', size = 'md', full = false, icon: Icon, to, className = '', children, ...rest }) => {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full border-2 font-['Montserrat'] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${full ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      {Icon && <Icon size={size === 'xs' || size === 'sm' ? 13 : 15} />}
      {children}
    </>
  );

  if (to) {
    return <Link to={to} className={classes}>{content}</Link>;
  }

  return <button type={rest.type || 'button'} className={classes} {...rest}>{content}</button>;
};

export default Button;
