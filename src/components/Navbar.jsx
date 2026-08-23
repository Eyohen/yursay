import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';
import Button from './Button';

const logo = '/yursaylogo.png';

const navLinks = [
  { name: 'Discover', href: '/' },
  { name: 'Categories', href: '/categories' },
  { name: 'Search', href: '/search' },
  { name: 'For Businesses', href: '/business-dashboard' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav className="fixed z-50 w-full border-b border-white/[0.06] bg-[#1e3d4e]/[0.97] backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link to="/" className="flex flex-shrink-0 items-center gap-2">
          <img src={logo} alt="YurSay" className="h-9 w-auto" />
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`relative rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  active ? 'text-white' : 'text-white/60 hover:bg-white/[0.07] hover:text-white'
                }`}
              >
                {link.name}
                {active && <span className="absolute inset-x-3.5 bottom-1 h-[1.5px] rounded-full bg-[#c1ff72]" />}
              </Link>
            );
          })}
        </div>

        <div className="hidden flex-shrink-0 items-center gap-2 lg:flex">
          <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/50">
            <MapPin size={12} /> Lagos, NG
          </div>
          <div className="mx-1 h-6 w-px bg-white/[0.12]" />
          <Button variant="accent" size="sm" onClick={() => navigate('/write-review')}>Write a Review</Button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-full border border-white/[0.16] bg-white/[0.08] px-4 py-2 font-['Montserrat'] text-[12px] font-semibold text-white/85 transition-colors hover:border-white/30 hover:bg-white/[0.14] hover:text-white"
          >
            Log In
          </button>
        </div>

        <button
          className="text-white/80 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="animate-slide-down bg-[#1e3d4e] px-5 pb-5 pt-2 shadow-xl lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="accent" size="md" full onClick={() => { setMobileOpen(false); navigate('/write-review'); }}>
              Write a Review
            </Button>
            <button
              type="button"
              onClick={() => { setMobileOpen(false); navigate('/login'); }}
              className="w-full rounded-full border border-white/[0.16] bg-white/[0.08] py-2.5 font-['Montserrat'] text-sm font-semibold text-white/85"
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
