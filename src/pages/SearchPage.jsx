import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, AtSign, BadgeCheck, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Stars from '../components/Stars';
import Chip from '../components/Chip';
import Button from '../components/Button';
import TrustPill from '../components/TrustPill';
import { searchVendors, getCategories, adaptVendor } from '../lib/vendors';

const SORTS = [
  { value: 'most-reviewed', label: 'Most Reviewed' },
  { value: 'highest-rated', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Listed' },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');
  const [minRating, setMinRating] = useState(Number(searchParams.get('minRating') || 0));
  const [sort, setSort] = useState(searchParams.get('sort') || 'most-reviewed');

  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories).catch((err) => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {
      sort,
      ...(searchParams.get('q') ? { q: searchParams.get('q') } : {}),
      ...(searchParams.get('category') ? { categoryId: searchParams.get('category') } : {}),
      ...(minRating ? { minRating } : {}),
      ...(verifiedOnly ? { verifiedOnly: true } : {}),
    };

    searchVendors(params)
      .then((res) => {
        setResults(res.data.map(adaptVendor));
        setTotal(res.meta.total);
      })
      .catch((err) => console.error('Search failed', err))
      .finally(() => setLoading(false));
  }, [searchParams, sort, minRating, verifiedOnly]);

  const runSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (categoryId) params.set('category', categoryId);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />
      <main>
        <section className="bg-[#1e3d4e] px-4 pb-8 pt-[110px] text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-1 font-['Montserrat'] text-xl font-extrabold tracking-tight">Search Results</h1>
            <p className="mb-5 text-sm text-white/50">
              {total} {total === 1 ? 'result' : 'results'}{searchParams.get('q') ? ` for "${searchParams.get('q')}"` : ''}
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); runSearch(); }}
              className="flex h-[52px] max-w-[660px] items-center gap-3 rounded-full border border-white/15 bg-white/[0.08] px-5"
            >
              <Search size={17} className="flex-shrink-0 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search businesses, vendors or @handles…"
                aria-label="Search"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <Button type="submit" variant="accent" size="sm">Search</Button>
            </form>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            {/* Filters */}
            <aside className="h-fit rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <div className="mb-5">
                <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-[#1e3d4e]">Rating</p>
                {[0, 3, 4].map((r) => (
                  <label key={r} className="flex items-center gap-2 py-1 text-sm text-[#4b6175]">
                    <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="accent-[#305d73]" />
                    {r === 0 ? 'All ratings' : `${r}+ stars`}
                  </label>
                ))}
              </div>
              <div className="mb-5 border-t border-[#f0f2f4] pt-5">
                <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-[#1e3d4e]">Category</p>
                <label className="flex items-center gap-2 py-1 text-sm text-[#4b6175]">
                  <input type="radio" name="cat" checked={!categoryId} onChange={() => setCategoryId('')} className="accent-[#305d73]" />
                  All categories
                </label>
                {categories.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 py-1 text-sm text-[#4b6175]">
                    <input type="radio" name="cat" checked={categoryId === c.id} onChange={() => setCategoryId(c.id)} className="accent-[#305d73]" />
                    {c.name}
                  </label>
                ))}
              </div>
              <div className="mb-5 border-t border-[#f0f2f4] pt-5">
                <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-[#1e3d4e]">Verification</p>
                <label className="flex items-center gap-2 py-1 text-sm text-[#4b6175]">
                  <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="accent-[#305d73]" /> Verified Only
                </label>
              </div>
              <Button variant="primary" size="sm" full onClick={runSearch}>Apply Filters</Button>
            </aside>

            {/* Results */}
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#4b6175]">{total} results</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-[#dde8ef] px-3 py-2 text-sm text-[#4b6175]"
                >
                  {SORTS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-4">
                {results.map((v) => (
                  <div
                    key={v.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/business/${v.id}`)}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/business/${v.id}`)}
                    className="flex cursor-pointer flex-col items-start gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-5 text-left transition-all hover:border-[#7ab8d4] hover:shadow-lg sm:flex-row sm:items-center"
                  >
                    <span
                      className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl font-['Montserrat'] text-base font-black text-white"
                      style={{ background: v.gradient }}
                    >
                      {v.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-['Montserrat'] text-[15px] font-bold text-[#1e3d4e]">{v.name}</span>
                        {v.verified && <Chip variant="ok" size="sm" icon={BadgeCheck}>Verified</Chip>}
                        {v.handle && <Chip variant="acc" size="sm" icon={AtSign}>{v.handle}</Chip>}
                      </div>
                      <p className="flex items-center gap-1 text-xs text-[#8fa3b4]">{v.category}{v.location && <> · <MapPin size={11} /> {v.location}</>}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Stars rating={v.rating} size={13} />
                        <strong className="text-sm text-[#1e3d4e]">{v.rating.toFixed(1)}</strong>
                        <span className="text-xs text-[#8fa3b4]">({v.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-center gap-2 sm:items-end">
                      <TrustPill score={v.trustScore} />
                      <Button
                        variant="primary" size="sm"
                        onClick={(e) => { e.stopPropagation(); navigate(`/business/${v.id}`); }}
                      >
                        View Reviews
                      </Button>
                    </div>
                  </div>
                ))}
                {!loading && results.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[#dde8ef] p-12 text-center text-sm text-[#8fa3b4]">
                    No businesses match your filters yet. Try clearing a filter or searching a different term.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
