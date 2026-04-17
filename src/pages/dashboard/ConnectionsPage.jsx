import { useState } from 'react';

const tabs = ['All Connections', 'Pending', 'Sent'];

const connections = [
  { name: 'TechVentures Inc.', type: 'Technology Partner', avatar: 'TV', connected: 'Connected 2 weeks ago', verified: true, status: 'connected' },
  { name: 'GreenScale Solutions', type: 'Service Provider', avatar: 'GS', connected: 'Connected 1 month ago', verified: true, status: 'connected' },
  { name: 'Bloom Strategy', type: 'Consultant', avatar: 'BS', connected: 'Connected 3 weeks ago', verified: false, status: 'connected' },
  { name: 'Meridian Logistics', type: 'Supply Chain', avatar: 'ML', connected: 'Connected 1 month ago', verified: true, status: 'connected' },
  { name: 'EduPrime Africa', type: 'EdTech', avatar: 'EA', connected: 'Connected 2 months ago', verified: false, status: 'connected' },
];

const pendingRequests = [
  { name: 'Atlas Capital Group', type: 'Investment Firm', avatar: 'AC', time: '2 hours ago', verified: true },
  { name: 'Keystone Partners', type: 'Advisory', avatar: 'KP', time: '1 day ago', verified: true },
  { name: 'Nexus Digital', type: 'Digital Agency', avatar: 'ND', time: '2 days ago', verified: false },
];

const sentRequests = [
  { name: 'NovaBridge Labs', type: 'R&D Lab', avatar: 'NL', time: '3 hours ago', status: 'pending' },
  { name: 'Vantage Analytics', type: 'Data Analytics', avatar: 'VA', time: '1 day ago', status: 'pending' },
];

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState('All Connections');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Connections</h1>
        <p className="text-gray-500 mt-1">Manage your business network and connection requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {tab === 'Pending' && (
              <span className="ml-1.5 bg-accent text-white text-xs px-1.5 py-0.5 rounded-full">{pendingRequests.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* All Connections */}
      {activeTab === 'All Connections' && (
        <div className="space-y-3">
          {connections.map((conn) => (
            <div key={conn.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                  {conn.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{conn.name}</p>
                    {conn.verified && (
                      <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{conn.type} &middot; {conn.connected}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-medium text-accent border border-accent rounded-lg hover:bg-accent hover:text-white transition-all">
                  Message
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending */}
      {activeTab === 'Pending' && (
        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <div key={req.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-sm">
                  {req.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{req.name}</p>
                  <p className="text-xs text-gray-500">{req.type} &middot; {req.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-medium text-white bg-accent rounded-lg hover:bg-accent-dark transition-colors">
                  Accept
                </button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sent */}
      {activeTab === 'Sent' && (
        <div className="space-y-3">
          {sentRequests.map((req) => (
            <div key={req.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                  {req.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{req.name}</p>
                  <p className="text-xs text-gray-500">{req.type} &middot; Sent {req.time}</p>
                </div>
              </div>
              <span className="text-xs text-amber-500 font-medium bg-amber-50 px-2.5 py-1 rounded-full">Pending</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
