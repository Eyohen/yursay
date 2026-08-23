import { useNavigate } from 'react-router-dom';
import { AtSign, Hash, Music2, MessageCircle } from 'lucide-react';

const logo = '/yursaylogo.png';

const socialLinks = [
  { name: 'Instagram', icon: AtSign },
  { name: 'Twitter/X', icon: Hash },
  { name: 'TikTok', icon: Music2 },
  { name: 'WhatsApp', icon: MessageCircle },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-white/10 bg-[#0D1A22] px-4 pb-8 pt-14 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <img src={logo} alt="YurSay" className="h-8 w-auto" />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              Africa&apos;s first dedicated consumer review platform. Real experiences. Verified vendors. Transparent trust — from Lagos to 54 countries.
            </p>
            <div className="mt-5 flex gap-3">
              {socialLinks.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  aria-label={s.name}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <s.icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Discover</h4>
            <ul className="space-y-2.5">
              <li><button type="button" onClick={() => navigate('/search')} className="text-sm text-white/55 transition-colors hover:text-white">Search Businesses</button></li>
              <li><button type="button" onClick={() => navigate('/categories')} className="text-sm text-white/55 transition-colors hover:text-white">Browse Categories</button></li>
              <li><button type="button" onClick={() => navigate('/')} className="text-sm text-white/55 transition-colors hover:text-white">Top Rated</button></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">For Businesses</h4>
            <ul className="space-y-2.5">
              <li><button type="button" onClick={() => navigate('/signup')} className="text-sm text-white/55 transition-colors hover:text-white">Claim Your Business</button></li>
              <li><button type="button" onClick={() => navigate('/write-review')} className="text-sm text-white/55 transition-colors hover:text-white">Write a Review</button></li>
              <li><a href="mailto:hello@yursay.com" className="text-sm text-white/55 transition-colors hover:text-white">hello@yursay.com</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">&copy; 2026 YurSay Technology Limited · Lagos, Nigeria</p>
          <p className="text-xs text-white/40">Built for Africa · Starting Nigeria → 54 Countries</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
