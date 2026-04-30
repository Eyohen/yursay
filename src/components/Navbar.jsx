import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const logo = '/yursaylogo.png'

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Features', href: '#features' },
  { name: 'How it works', href: '#how-it-works' },
  { name: 'Why YurSay', href: '#why-yursay' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 8);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  return (
    <nav className="fixed z-50 w-full bg-[#1E3D4E]/50 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1284px] items-center justify-between px-5 py-3 sm:px-8 lg:px-10">

        <Link to="/" className="flex items-center gap-2 text-primary-dark font-display font-extrabold text-xl">
         
          <img src={logo} alt="YurSay" className="h-10 w-auto" />
          
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-1.5 text-sm font-semibold text-white hover:text-primary-dark transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a
            href="#waitlist"
            className="px-5 py-2.5 text-sm font-bold bg-[#C1FF72] text-primary-dark rounded-lg hover:bg-lime-300 transition-colors"
          >
            Join the Waitlist
          </a>
        </div>

        <button
          className="lg:hidden text-primary-dark p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-[1284px] bg-white/97 p-4 shadow-xl shadow-black/10 animate-slide-down lg:hidden sm:px-8 lg:px-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block py-2.5 text-sm font-semibold text-ink-secondary hover:text-primary-dark"
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#waitlist"
            className="mt-3 block w-full py-2.5 text-sm font-bold text-primary-dark bg-[#C1FF72] rounded-lg hover:bg-lime-300 transition-colors text-center"
            onClick={() => setMobileOpen(false)}
          >
            Join the Waitlist
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
