import { useState, useRef, useEffect } from 'react';

const conversations = [
  {
    id: 'support',
    name: 'Connectin Support',
    avatar: 'CS',
    isAdmin: true,
    online: true,
    lastMessage: "We're here to help! Let us know if you need anything.",
    time: 'Just now',
    unread: 1,
    messages: [
      { id: 1, from: 'them', text: "Welcome to Connectin! We're glad to have you on board.", time: '10:00 AM' },
      { id: 2, from: 'them', text: "If you have any questions about using the platform, setting up your profile, or finding the right connections — don't hesitate to reach out.", time: '10:01 AM' },
      { id: 3, from: 'me', text: "Thanks! I'm excited to get started. How do I boost my profile visibility?", time: '10:15 AM' },
      { id: 4, from: 'them', text: 'Great question! You can upgrade to our Premium plan to get a visibility boost on search results. You can also complete your profile fully — businesses with complete profiles get 3x more connection requests.', time: '10:18 AM' },
      { id: 5, from: 'them', text: "We're here to help! Let us know if you need anything.", time: '10:19 AM' },
    ],
  },
  {
    id: 'tv',
    name: 'TechVentures Inc.',
    avatar: 'TV',
    isAdmin: false,
    online: true,
    lastMessage: "That sounds great! Let's schedule a call this week.",
    time: '2h ago',
    unread: 2,
    messages: [
      { id: 1, from: 'them', text: 'Hi John! We saw your company profile and think there could be a great synergy between our products.', time: '9:00 AM' },
      { id: 2, from: 'me', text: "Hi! Thanks for reaching out. I checked your profile too — your API platform looks impressive. What kind of partnership are you thinking about?", time: '9:30 AM' },
      { id: 3, from: 'them', text: "We're looking for an integration partner to help us connect our CRM tools with enterprise clients. Your team's experience seems like a perfect fit.", time: '9:45 AM' },
      { id: 4, from: 'me', text: "That's definitely something we can help with. We've done similar integrations for other B2B platforms.", time: '10:00 AM' },
      { id: 5, from: 'them', text: "That sounds great! Let's schedule a call this week.", time: '10:05 AM' },
    ],
  },
  {
    id: 'gs',
    name: 'GreenScale Solutions',
    avatar: 'GS',
    isAdmin: false,
    online: false,
    lastMessage: 'Looking forward to the proposal.',
    time: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'Hello! We connected at the B2B Mixer last month. Wanted to follow up on the health-tech collaboration.', time: 'Mon 2:00 PM' },
      { id: 2, from: 'me', text: "Yes, I remember! Great to reconnect. We've been working on a pilot program that might align well.", time: 'Mon 3:15 PM' },
      { id: 3, from: 'them', text: 'That sounds interesting. Could you share more details? Maybe a brief proposal?', time: 'Mon 4:00 PM' },
      { id: 4, from: 'me', text: "Sure, I'll put something together and send it over by end of week.", time: 'Tue 9:00 AM' },
      { id: 5, from: 'them', text: 'Looking forward to the proposal.', time: 'Tue 9:15 AM' },
    ],
  },
  {
    id: 'ac',
    name: 'Atlas Capital Group',
    avatar: 'AC',
    isAdmin: false,
    online: true,
    lastMessage: "We'd love to learn more about your growth metrics.",
    time: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, from: 'them', text: "Hi John, we're an early-stage VC and your company caught our attention. Are you currently raising?", time: 'Mon 11:00 AM' },
      { id: 2, from: 'me', text: "We're exploring options for our Series A. Would be great to chat.", time: 'Mon 2:00 PM' },
      { id: 3, from: 'them', text: "We'd love to learn more about your growth metrics.", time: 'Mon 2:30 PM' },
    ],
  },
  {
    id: 'bs',
    name: 'Bloom Strategy',
    avatar: 'BS',
    isAdmin: false,
    online: false,
    lastMessage: 'Thanks for the intro!',
    time: '3 days ago',
    unread: 0,
    messages: [
      { id: 1, from: 'me', text: 'Hi! I saw your consulting profile. We might need GTM strategy help for our new product line.', time: 'Fri 10:00 AM' },
      { id: 2, from: 'them', text: "Hi John! We'd be happy to help. Can you share more about the product and target market?", time: 'Fri 11:30 AM' },
      { id: 3, from: 'me', text: "It's a B2B SaaS tool targeting mid-market companies in West Africa. I'll send over a brief.", time: 'Fri 12:00 PM' },
      { id: 4, from: 'them', text: 'Thanks for the intro!', time: 'Fri 12:15 PM' },
    ],
  },
];

const MessagesPage = () => {
  const [activeConvo, setActiveConvo] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState({});
  const [showConvoList, setShowConvoList] = useState(true);
  const messagesEndRef = useRef(null);

  const currentMessages = [
    ...activeConvo.messages,
    ...(localMessages[activeConvo.id] || []),
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, activeConvo.id]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      from: 'me',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLocalMessages((prev) => ({
      ...prev,
      [activeConvo.id]: [...(prev[activeConvo.id] || []), msg],
    }));
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-4 lg:-m-8 bg-white rounded-xl lg:rounded-none overflow-hidden border border-gray-200 lg:border-0">
      {/* Conversation list */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-white flex-shrink-0 ${!showConvoList ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Messages</h2>
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => { setActiveConvo(convo); setShowConvoList(false); }}
              className={`w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                activeConvo.id === convo.id ? 'bg-accent/5' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  convo.isAdmin ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
                }`}>
                  {convo.avatar}
                </div>
                {convo.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-900 truncate">{convo.name}</p>
                    {convo.isAdmin && (
                      <span className="text-[10px] font-semibold bg-accent/10 text-accent px-1.5 py-0.5 rounded">TEAM</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{convo.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{convo.lastMessage}</p>
              </div>
              {convo.unread > 0 && (
                <span className="bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  {convo.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${showConvoList ? 'hidden md:flex' : 'flex'}`}>
        {/* Chat header */}
        <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-400 hover:text-gray-600 mr-1" onClick={() => setShowConvoList(true)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                activeConvo.isAdmin ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
              }`}>
                {activeConvo.avatar}
              </div>
              {activeConvo.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-gray-900">{activeConvo.name}</p>
                {activeConvo.isAdmin && (
                  <span className="text-[10px] font-semibold bg-accent/10 text-accent px-1.5 py-0.5 rounded">TEAM</span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {activeConvo.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4 bg-gray-50/50">
          {currentMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${msg.from === 'me' ? 'order-1' : ''}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === 'me'
                    ? 'bg-accent text-white rounded-br-md'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-sm'
                }`}>
                  {msg.text}
                </div>
                <p className={`text-[10px] text-gray-400 mt-1 ${msg.from === 'me' ? 'text-right' : ''}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2.5 bg-accent text-white rounded-full hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessagesPage;
