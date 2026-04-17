import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'How it works', href: '#how-it-works' },
  { name: 'For consumers', href: '#consumers' },
  { name: 'For vendors', href: '#vendors' },
  { name: 'Trust Badge', href: '#trust-badge' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 8);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    if (href.startsWith('/')) return location.pathname === href;
    return false;
  };

  const isRoute = (href) => href.startsWith('/');
  const desktopNavLinkClass = isScrolled
    ? 'text-primary hover:text-primary-dark'
    : 'text-white hover:text-white';

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[93%] max-w-6xl">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-white/92 backdrop-blur-md border border-white/70 shadow-lg shadow-primary-dark/10 rounded-lg">
        <Link to="/" className="flex items-center gap-2 text-primary-dark font-display font-extrabold text-xl">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">Y</span>
          <span>YurSay</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            isRoute(link.href) ? (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${desktopNavLinkClass}`}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-semibold transition-colors ${desktopNavLinkClass}`}
              >
                {link.name}
              </a>
            )
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-white hover:text-white transition-colors">
            Sign in
          </Link>
          <a href="#waitlist" className="px-5 py-2.5 text-sm font-bold bg-[#C1FF72] text-primary rounded-lg hover:bg-primary-dark transition-colors">
            Join waitlist
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
        <div className="lg:hidden mt-2 p-4 bg-white/97 backdrop-blur-md border border-line rounded-lg shadow-xl shadow-primary-dark/10 animate-slide-down">
          {navLinks.map((link) =>
            isRoute(link.href) ? (
              <Link
                key={link.name}
                to={link.href}
                className={`block py-2.5 text-sm font-medium ${
                  isActive(link.href) ? 'text-primary' : 'text-ink-secondary hover:text-primary-dark'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="block py-2.5 text-sm font-semibold text-ink-secondary hover:text-primary-dark"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </a>
            )
          )}
          <Link to="/login" className="mt-3 block w-full py-2.5 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors text-center" onClick={() => setMobileOpen(false)}>
            Sign in
          </Link>
          <a href="#waitlist" className="mt-3 block w-full py-2.5 text-sm font-bold text-primary bg-[#C1FF72] rounded-lg hover:bg-primary-dark transition-colors text-center" onClick={() => setMobileOpen(false)}>
            Join waitlist
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
