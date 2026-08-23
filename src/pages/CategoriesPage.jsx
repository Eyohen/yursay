import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryIcon from '../components/CategoryIcon';
import Eyebrow from '../components/Eyebrow';
import { getCategories, gradientFor } from '../lib/vendors';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch((err) => console.error('Failed to load categories', err));
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#1e3d4e] px-4 pb-16 pt-[130px] text-center text-white sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_100%_at_80%_50%,rgba(193,255,114,0.08)_0,transparent_60%)]" />
          <div className="relative mx-auto max-w-2xl">
            <Eyebrow variant="white" icon={LayoutGrid} className="mb-4">Explore All Categories</Eyebrow>
            <h1 className="mb-3 font-['Montserrat'] text-3xl font-black tracking-tight text-white sm:text-4xl">Browse Categories</h1>
            <p className="mx-auto max-w-sm text-[15px] text-white/55">Discover trusted businesses across every industry in Africa</p>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/search?category=${cat.id}`)}
                className="flex flex-col items-start gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#7ab8d4] hover:shadow-lg"
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl text-white"
                  style={{ background: gradientFor(cat.id) }}
                >
                  <CategoryIcon icon={cat.icon} size={22} />
                </span>
                <div>
                  <p className="font-['Montserrat'] text-[15px] font-bold text-[#1e3d4e]">{cat.name}</p>
                  <p className="mt-0.5 text-xs text-[#8fa3b4]">{cat.vendorCount} {cat.vendorCount === 1 ? 'business' : 'businesses'}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
