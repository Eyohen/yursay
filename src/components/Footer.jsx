const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'How it works', href: '#how-it-works' },
  { name: 'For consumers', href: '#consumers' },
  { name: 'For vendors', href: '#vendors' },
  { name: 'Trust Badge', href: '#trust-badge' },
];

const companyLinks = [
  { name: 'Join waitlist', href: '#waitlist' },
  { name: 'hello@yursay.com', href: 'mailto:hello@yursay.com' },
];

const Footer = () => {
  return (
    <footer className="bg-primary-dark border-t border-white/10 pt-14 pb-8 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <span className="font-display text-white font-extrabold text-2xl">YurSay</span>
            <p className="text-white/70 text-sm mt-3 max-w-sm leading-relaxed">
              Africa&apos;s consumer review and trust platform for shoppers, social commerce vendors, restaurants, and local businesses.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/65 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/65 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/50 text-xs">
            &copy; 2026 YurSay. All rights reserved.
          </p>
          <a href="#" className="text-white/50 hover:text-white/80 text-xs transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
