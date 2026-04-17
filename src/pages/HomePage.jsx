import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const heroImage = '/hero1.png';
const vendorImage = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80';

const metrics = [
  { value: '500+', label: 'beta reviews target' },
  { value: '50+', label: 'verified vendors at launch' },
  { value: '<90s', label: 'review submission goal' },
  { value: '2', label: 'launch cities: Lagos and Abuja' },
];

const steps = [
  {
    title: 'Search any vendor',
    body: 'Look up a business name, social handle, restaurant, or service provider before you pay.',
  },
  {
    title: 'Check real proof',
    body: 'Read ratings, photos, purchase badges, response history, and scam warnings in one place.',
  },
  {
    title: 'Share your say',
    body: 'Publish text and photo reviews that help the next shopper make a safer decision.',
  },
];

const categories = ['Fashion', 'Food', 'Beauty', 'Electronics', 'Home services', 'Social vendors'];

const reviewHighlights = [
  'Verified purchase proof',
  'Helpful community votes',
  'Photo evidence',
  'Public vendor response',
];

const formInitialState = {
  name: '',
  email: '',
  role: 'Consumer',
  city: '',
};

const HomePage = () => {
  const [form, setForm] = useState(formInitialState);
  const [formState, setFormState] = useState({ submitted: false, error: '' });

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitWaitlist = (event) => {
    event.preventDefault();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    if (!form.name.trim() || !form.city.trim() || !emailIsValid) {
      setFormState({
        submitted: false,
        error: 'Enter your name, city, and a valid email address.',
      });
      return;
    }

    setFormState({ submitted: true, error: '' });
    setForm(formInitialState);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <main>
        <section id="home" className="relative min-h-[92svh] overflow-hidden bg-primary-dark text-white">
          <img
            src={heroImage}
            alt="Customer paying a small business owner while checking a phone"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-dark/78" />

          <div className="relative mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-center px-4 pb-16 pt-32 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-3xl"
            >
              <p className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/12 px-3 py-2 text-sm font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-[#C1FF72]" />
                Launching first in Lagos and Abuja
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-7xl">
                Know who to trust before you buy.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                YurSay is Africa&apos;s consumer review and trust platform for shoppers, restaurants, local businesses, and social media vendors.
              </p>

              <div className="mt-8 max-w-2xl rounded-lg bg-white p-2 shadow-2xl shadow-black/25">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="sr-only" htmlFor="hero-search">Search vendor handle</label>
                  <input
                    id="hero-search"
                    type="text"
                    readOnly
                    value="@luxurycloset_ng"
                    className="min-h-12 flex-1 rounded-lg border border-line bg-primary-50 px-4 text-base font-semibold text-primary-dark outline-none"
                    aria-label="Example vendor handle search"
                  />
                  <a href="#waitlist" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#C1FF72] px-6 text-sm font-extrabold text-primary-dark transition-colors hover:bg-white">
                    Join waitlist
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: 'easeOut' }}
              className="mt-10 grid max-w-4xl gap-4 md:grid-cols-3"
              aria-label="YurSay product preview"
            >
              <div className="rounded-lg border border-white/18 bg-white p-4 text-ink shadow-xl shadow-black/18">
                <p className="text-xs font-bold uppercase text-primary">Verified vendor</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-ink">Kemi&apos;s Kitchen</h2>
                    <p className="text-sm text-ink-secondary">@kemiskitchen.ng</p>
                  </div>
                  <span className="rounded-lg bg-success/10 px-2 py-1 text-xs font-bold text-success">Trust Badge</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[#C1FF72]">
                  <span className="text-xl font-extrabold">4.8</span>
                  <span aria-hidden="true">★★★★★</span>
                </div>
                <p className="mt-2 text-sm text-ink-secondary">312 reviews · Lagos</p>
              </div>

              <div className="rounded-lg border border-white/18 bg-primary-50 p-4 text-ink shadow-xl shadow-black/18">
                <p className="text-xs font-bold uppercase text-primary">Review proof</p>
                <p className="mt-3 text-sm leading-6 text-ink-secondary">
                  &quot;Delivery matched the photos and the food arrived hot. Receipt uploaded.&quot;
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <span className="h-16 rounded-lg bg-white" />
                  <span className="h-16 rounded-lg bg-white" />
                  <span className="h-16 rounded-lg bg-white" />
                </div>
              </div>

              <div className="rounded-lg border border-white/18 bg-white p-4 text-ink shadow-xl shadow-black/18">
                <p className="text-xs font-bold uppercase text-warning">Scam safety</p>
                <h2 className="mt-3 text-lg font-extrabold">Under investigation</h2>
                <p className="mt-2 text-sm leading-6 text-ink-secondary">
                  Public notices help shoppers pause when evidence is being reviewed.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-line bg-white px-4 py-8">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-line bg-canvas p-5">
                <p className="font-display text-3xl font-extrabold text-primary-dark">{metric.value}</p>
                <p className="mt-1 text-sm font-semibold text-ink-secondary">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase text-[#C1FF72]">How it works</p>
              <h2 className="mt-3 text-3xl font-extrabold text-primary-dark sm:text-5xl">
                A trust layer for the places Africans already buy.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <article key={step.title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-sm font-extrabold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-2xl font-extrabold text-ink">{step.title}</h3>
                  <p className="mt-3 leading-7 text-ink-secondary">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="consumers" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-sm font-extrabold uppercase text-[#C1FF72]">For consumers</p>
              <h2 className="mt-3 text-3xl font-extrabold text-primary-dark sm:text-5xl">
                Search the handle before sending money.
              </h2>
              <p className="mt-5 text-lg leading-8 text-ink-secondary">
                YurSay gives cautious shoppers one place to verify Instagram sellers, food vendors, beauty providers, electronics shops, and local services before a transaction starts.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {reviewHighlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border border-line bg-canvas p-4">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-success text-sm font-bold text-white">✓</span>
                    <span className="font-semibold text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-line bg-canvas p-4">
              <div className="rounded-lg bg-white p-5 shadow-lg shadow-primary-dark/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-primary">Review from Adaeze</p>
                    <h3 className="mt-1 text-2xl font-extrabold">4.0 for @stylemarket_ng</h3>
                  </div>
                  <span className="text-[#C1FF72]" aria-label="4 star rating">★★★★☆</span>
                </div>
                <p className="mt-4 leading-7 text-ink-secondary">
                  The package arrived two days late, but the quality matched what was advertised. Customer support replied quickly.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <img
                    src={vendorImage}
                    alt="Beauty products arranged for online sale"
                    className="h-24 w-full rounded-lg object-cover"
                  />
                  <div className="rounded-lg bg-primary-50 p-3 text-sm font-bold text-primary-dark">Receipt uploaded</div>
                  <div className="rounded-lg bg-[#C1FF72]/20 p-3 text-sm font-bold text-primary-dark">Helpful · 18</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="vendors" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg bg-primary-dark p-8 text-white">
              <p className="text-sm font-extrabold uppercase text-[#C1FF72]">For vendors</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">
                Turn reputation into a visible advantage.
              </h2>
              <p className="mt-5 leading-8 text-white/76">
                Claim your profile, prove your account is legitimate, reply to reviews, and give customers a reason to choose the real business over copycats.
              </p>
              <a href="#waitlist" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#C1FF72] px-6 text-sm font-extrabold text-primary-dark transition-colors hover:bg-white">
                Join as a vendor
              </a>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                ['Claimed profile', 'Business details, social links, opening hours, and public review history.'],
                ['Public responses', 'Reply once per review and show accountability where customers can see it.'],
                ['Reputation dashboard', 'Track review count, Trust Score, response rate, and rating trends.'],
                ['Scam protection', 'Help customers separate legitimate accounts from impersonators.'],
              ].map(([title, body]) => (
                <article key={title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-extrabold text-primary-dark">{title}</h3>
                  <p className="mt-3 leading-7 text-ink-secondary">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="trust-badge" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="text-sm font-extrabold uppercase text-[#C1FF72]">Trust Badge</p>
                <h2 className="mt-3 text-3xl font-extrabold text-primary-dark sm:text-5xl">
                  A visible signal that a vendor has been checked.
                </h2>
                <p className="mt-5 text-lg leading-8 text-ink-secondary">
                  YurSay verification supports social story codes, business document review, and phone OTP checks, so customers can see which vendors have taken trust seriously.
                </p>
              </div>
              <div className="rounded-lg border border-line bg-primary-50 p-6">
                <div className="rounded-lg bg-white p-6 shadow-lg shadow-primary-dark/10">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-lg bg-success text-2xl font-extrabold text-white">✓</span>
                    <div>
                      <h3 className="text-2xl font-extrabold text-primary-dark">YurSay Trust Badge</h3>
                      <p className="text-sm font-semibold text-ink-secondary">Identity and business legitimacy checked</p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3">
                    {['Social account control confirmed', 'Business details reviewed', 'Badge visible in search results'].map((item) => (
                      <div key={item} className="rounded-lg border border-line bg-canvas px-4 py-3 text-sm font-semibold text-ink-secondary">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-sm font-extrabold uppercase text-primary">Popular launch categories</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <span key={category} className="rounded-lg border border-line bg-canvas px-4 py-2 text-sm font-bold text-primary-dark">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="waitlist" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-lg bg-primary p-6 text-white shadow-xl shadow-primary-dark/15 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <div>
              <p className="text-sm font-extrabold uppercase text-[#C1FF72]">Early access</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">
                Join the YurSay beta waitlist.
              </h2>
              <p className="mt-5 leading-8 text-white/78">
                Be first to search verified vendors, publish safer reviews, or claim your business profile when beta access opens.
              </p>
            </div>

            <form onSubmit={submitWaitlist} className="rounded-lg bg-white p-5 text-ink shadow-lg" noValidate>
              {formState.submitted ? (
                <div className="rounded-lg border border-success/25 bg-success/10 p-5">
                  <h3 className="text-2xl font-extrabold text-success">You are on the list.</h3>
                  <p className="mt-2 leading-7 text-ink-secondary">
                    We will share beta access updates as YurSay opens in Lagos and Abuja.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="waitlist-name" className="text-sm font-bold text-ink">Name</label>
                      <input
                        id="waitlist-name"
                        name="name"
                        value={form.name}
                        onChange={updateForm}
                        className="mt-2 min-h-12 w-full rounded-lg border border-line px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary-50"
                        placeholder="Adaeze Okafor"
                      />
                    </div>
                    <div>
                      <label htmlFor="waitlist-email" className="text-sm font-bold text-ink">Email</label>
                      <input
                        id="waitlist-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={updateForm}
                        className="mt-2 min-h-12 w-full rounded-lg border border-line px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary-50"
                        placeholder="adaeze@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="waitlist-role" className="text-sm font-bold text-ink">I am joining as</label>
                      <select
                        id="waitlist-role"
                        name="role"
                        value={form.role}
                        onChange={updateForm}
                        className="mt-2 min-h-12 w-full rounded-lg border border-line px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary-50"
                      >
                        <option>Consumer</option>
                        <option>Vendor</option>
                        <option>Both</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="waitlist-city" className="text-sm font-bold text-ink">City</label>
                      <input
                        id="waitlist-city"
                        name="city"
                        value={form.city}
                        onChange={updateForm}
                        className="mt-2 min-h-12 w-full rounded-lg border border-line px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary-50"
                        placeholder="Lagos"
                      />
                    </div>
                  </div>
                  {formState.error && (
                    <p className="mt-4 rounded-lg bg-error/10 px-4 py-3 text-sm font-semibold text-error">
                      {formState.error}
                    </p>
                  )}
                  <button type="submit" className="mt-5 min-h-12 w-full rounded-lg bg-primary px-6 text-sm font-extrabold text-white transition-colors hover:bg-primary-dark">
                    Request early access
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
