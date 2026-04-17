import { useState } from 'react';
import AvailabilityCalendar from '../../components/bookings/AvailabilityCalendar';
import BookingModal from '../../components/bookings/BookingModal';

const industries = ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Manufacturing'];

const businesses = [
  { name: 'TechVentures Inc.', industry: 'Technology', type: 'SaaS Company', location: 'Lagos, Nigeria', match: 92, verified: true, avatar: 'TV', bio: 'Building next-gen enterprise software solutions for African markets.' },
  { name: 'GreenScale Solutions', industry: 'Healthcare', type: 'Service Provider', location: 'Nairobi, Kenya', match: 87, verified: true, avatar: 'GS', bio: 'Sustainable health-tech solutions for underserved communities.' },
  { name: 'Atlas Capital Group', industry: 'Finance', type: 'Investment Firm', location: 'Accra, Ghana', match: 85, verified: true, avatar: 'AC', bio: 'Early-stage VC focused on B2B startups across West Africa.' },
  { name: 'Bloom Strategy', industry: 'Marketing', type: 'Consulting Firm', location: 'Cape Town, SA', match: 81, verified: false, avatar: 'BS', bio: 'Growth marketing and GTM strategy for scaling companies.' },
  { name: 'NovaBridge Labs', industry: 'Technology', type: 'R&D Lab', location: 'Kigali, Rwanda', match: 79, verified: true, avatar: 'NL', bio: 'Pioneering AI research and development partnerships.' },
  { name: 'Meridian Logistics', industry: 'Manufacturing', type: 'Supply Chain', location: 'Lagos, Nigeria', match: 76, verified: true, avatar: 'ML', bio: 'End-to-end supply chain management for African trade.' },
  { name: 'EduPrime Africa', industry: 'Education', type: 'EdTech', location: 'Kampala, Uganda', match: 74, verified: false, avatar: 'EA', bio: 'Digital learning platforms for professional development.' },
  { name: 'Keystone Partners', industry: 'Finance', type: 'Advisory', location: 'Dar es Salaam, TZ', match: 72, verified: true, avatar: 'KP', bio: 'M&A advisory and corporate finance for mid-market firms.' },
];

const DiscoverPage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [modalTab, setModalTab] = useState('About');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const openBusiness = (biz) => {
    setSelectedBusiness(biz);
    setModalTab('About');
    setSelectedSlot(null);
  };

  const closeModal = () => {
    setSelectedBusiness(null);
    setModalTab('About');
    setSelectedSlot(null);
  };

  const filtered = businesses.filter((b) => {
    const matchesIndustry = selectedIndustry === 'All' || b.industry === selectedIndustry;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Discover Businesses</h1>
        <p className="text-gray-500 mt-1">AI-powered matches based on your business profile and goals.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Industry pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {industries.map((ind) => (
          <button
            key={ind}
            onClick={() => setSelectedIndustry(ind)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedIndustry === ind
                ? 'bg-accent text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-accent hover:text-accent'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Business grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((biz) => (
          <div key={biz.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold">
                  {biz.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{biz.name}</h3>
                    {biz.verified && (
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{biz.type} &middot; {biz.location}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {biz.match}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{biz.bio}</p>
            <div className="flex items-center gap-2">
              <button className="flex-1 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-dark transition-colors">
                Connect
              </button>
              <button
                onClick={() => openBusiness(biz)}
                className="py-2 px-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Profile Modal */}
      {selectedBusiness && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className={`bg-white rounded-2xl w-full flex flex-col max-h-[90vh] transition-all duration-200 ${
              modalTab === 'Bookings' ? 'max-w-3xl' : 'max-w-lg'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-xl flex-shrink-0">
                  {selectedBusiness.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{selectedBusiness.name}</h2>
                    {selectedBusiness.verified && (
                      <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{selectedBusiness.type} &middot; {selectedBusiness.location}</p>
                  <span className="inline-block mt-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {selectedBusiness.match}% match
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Industry badge + tabs */}
            <div className="px-6 pb-4 flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                {selectedBusiness.industry}
              </span>
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                {['About', 'Bookings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={`px-4 py-1 text-xs font-medium rounded-md transition-all ${
                      modalTab === tab
                        ? 'bg-white text-gray-900 font-semibold shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'Bookings' ? (
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Bookings
                      </span>
                    ) : tab}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Tab content */}
            <div className="p-6 overflow-y-auto flex-1">
              {modalTab === 'About' && (
                <>
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">About</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedBusiness.bio}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-2.5 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-dark transition-colors"
                    >
                      Connect
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 py-2.5 text-sm font-semibold text-accent border border-accent rounded-lg hover:bg-accent hover:text-white transition-all"
                    >
                      Send Message
                    </button>
                  </div>
                </>
              )}

              {modalTab === 'Bookings' && (
                <AvailabilityCalendar
                  mode="view"
                  onBook={(slot) => setSelectedSlot(slot)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking confirmation modal */}
      {selectedSlot && selectedBusiness && (
        <BookingModal
          slot={selectedSlot}
          businessName={selectedBusiness.name}
          onClose={() => setSelectedSlot(null)}
          onConfirm={() => {
            setSelectedSlot(null);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default DiscoverPage;
