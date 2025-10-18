'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    MapPin, MessageSquare, User, Home, Plus, Star, ArrowLeft, Check, X, 
    Navigation, Moon, Sun, BrainCircuit, Settings as SettingsIcon, 
    Shield, ChevronRight, Gift, Users, Send, Award, Bell, CheckCircle2, UserCheck, Map as MapIcon
} from 'lucide-react';
import AIMatchingComponent from '@/components/AIMatchingComponent';
import PigeonMap from '@/app/components/PigeonMap';
import { useAuth } from '@/contexts/AuthContext';

const SCREENS = {
  SPLASH: 'splash',
  PERMISSIONS: 'permissions',
  HOME: 'home',
  REQUEST: 'request',
  GIVE: 'give', 
  COMMUNITY: 'community',
  POLICIES: 'policies',
  NOTIFICATIONS: 'notifications',
  REQUEST_SENT: 'request_sent',
  LOADING: 'loading',
  AI_MATCHING: 'ai_matching',
  MATCHES: 'matches', 
  ALL_MATCHES: 'all_matches',
  MAP: 'map',
  CHAT: 'chat',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  AI_PERMISSIONS: 'ai_permissions',
};

const PixelatedStarLogo = ({ className, ...props }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 0L10 10L0 12L10 14L12 24L14 14L24 12L14 10L12 0Z"/>
    </svg>
);

// Mock Data & Content
const GSU_CAMPUSES = ['Atlanta Campus', 'Clarkston Campus', 'Alpharetta Campus', 'Decatur Campus', 'Dunwoody Campus', 'Newton Campus'];

const allMatchesData = [
  { id: 1, name: 'Emma Chen', distance: '0.3 miles', items: 'Period Products', verified: true },
  { id: 2, name: 'Women\'s Center', distance: '0.5 miles', items: 'All Items', verified: true },
  { id: 3, name: 'Sarah Martinez', distance: '0.7 miles', items: 'Period Products', verified: false },
  { id: 4, name: 'Jessica B.', distance: '0.9 miles', items: 'Pain Relief', verified: false } 
];

const dropOffSpots = [
  { id: 1, name: 'GSU Women\'s Center', distance: '0.5 miles', verified: true },
  { id: 2, name: 'Midtown Community Clinic', distance: '1.2 miles', verified: true },
  { id: 3, name: 'Partner Store: Zara (Atlantic Station)', distance: '2.5 miles', verified: true },
];

const communityPosts = [
  { id: 1, thread: 'Restock Updates', content: 'Heads up! The Women\'s Center just got a huge donation of pads and tampons.', user: 'Anonymous', timestamp: '2h ago', verified: false },
  { id: 2, thread: 'Communal Hangouts / 3rd Spaces', content: 'Study group for finals at the GSU library, 3rd floor. Safe space, all welcome!', user: 'Maya J.', timestamp: '5h ago', verified: true },
  { id: 3, thread: 'Memes & Positivity', content: 'Just a reminder that you are all amazing and capable. You got this! ❤️', user: 'Anonymous', timestamp: '1d ago', verified: false },
  { id: 4, thread: 'Personal Stories', content: 'Feeling really overwhelmed with classes and personal stuff. Just needed to vent somewhere safe.', user: 'Anonymous', timestamp: '1d ago', verified: false },
  { id: 5, thread: 'Restock Updates', content: 'Zara at Atlantic Station has a donation bin at the front register till Friday.', user: 'Anonymous', timestamp: '3d ago', verified: false },
];

const notificationsData = [
  { id: 1, type: 'chat_request', from: { name: 'Alex R.', verified: true }, item: 'Pain Relief', isContact: true, status: 'pending' },
  { id: 2, type: 'chat_request', from: { name: 'Anonymous', verified: false }, item: 'Period Products', isContact: false, status: 'pending' },
  { id: 3, type: 'info', content: 'Your donation to GSU Women\'s Center has been logged.', status: 'read' },
  { id: 4, type: 'chat_request', from: { name: 'Jordan P.', verified: true}, item: 'Hygiene Items', isContact: true, status: 'accepted' },
];

export default function ClutchWireframe() {
  const { user, loading, logOut } = useAuth();
  const [currentScreen, setCurrentScreen] = useState(SCREENS.SPLASH);
  const [previousScreen, setPreviousScreen] = useState(SCREENS.SPLASH);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [requestItem, setRequestItem] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [aiPermissions, setAiPermissions] = useState(true);
  const [showWarning, setShowWarning] = useState(null); 
  const [whitelistedUsers, setWhitelistedUsers] = useState([]);
  const [communityTab, setCommunityTab] = useState('Restock Updates');
  const [notificationTab, setNotificationTab] = useState('All');
  const [sentRequests, setSentRequests] = useState([]); 
  const [requestSentTo, setRequestSentTo] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState('Atlanta Campus');

  const navigate = (screen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  useEffect(() => {
    if (currentScreen === SCREENS.LOADING) {
      const timer = setTimeout(() => { navigate(SCREENS.AI_MATCHING); }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [currentScreen, navigate]);

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, go to home screen
        setCurrentScreen(SCREENS.HOME);
      } else {
        // User is not authenticated, show splash screen
        setCurrentScreen(SCREENS.SPLASH);
      }
    }
  }, [user, loading]);

  const theme = {
    dark: {
      bg: 'bg-gray-950', bgSecondary: 'bg-gray-900', card: 'bg-gray-800', cardHover: 'hover:bg-gray-700',
      text: 'text-white', textSecondary: 'text-gray-300', textTertiary: 'text-gray-400',
      border: 'border-gray-700', input: 'bg-gray-800 text-white placeholder-gray-500', divider: 'border-gray-700'
    },
    light: {
      bg: 'bg-gray-50', bgSecondary: 'bg-gray-100', card: 'bg-white', cardHover: 'hover:bg-gray-50',
      text: 'text-gray-900', textSecondary: 'text-gray-700', textTertiary: 'text-gray-500',
      border: 'border-gray-200', input: 'bg-gray-100 text-gray-900 placeholder-gray-400', divider: 'border-gray-200'
    }
  };

  const t = darkMode ? theme.dark : theme.light;

  const goBack = () => {
    if (selectedChat) { setSelectedChat(null); return; }
    if (selectedMatch) { setSelectedMatch(null); return; }
    if (currentScreen === SCREENS.ALL_MATCHES) { setCurrentScreen(SCREENS.MATCHES); return; }
    if ([SCREENS.COMMUNITY, SCREENS.GIVE, SCREENS.NOTIFICATIONS, SCREENS.REQUEST_SENT, SCREENS.MAP].includes(currentScreen)) { setCurrentScreen(SCREENS.HOME); return; }
    setCurrentScreen(previousScreen);
  };
  
  const handleStartChat = (match) => {
    console.log(`Notification sent to ${match.name}`);
    setSentRequests([...sentRequests, match.id]);
    setRequestSentTo(match);
    navigate(SCREENS.REQUEST_SENT);
  };
  
  const handleDonation = (spot) => {
    console.log(`Donation logged at ${spot.name}`);
    setCommunityTab('Restock Updates');
    navigate(SCREENS.COMMUNITY);
  };
    
  const handleCreatePost = () => {
    console.log("New post created (demo only).");
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setCurrentScreen(SCREENS.SPLASH);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const ThemeToggle = () => (
    <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full transition ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
  
  const AppStyles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Caprasimo&family=Emblema+One&display=swap');
      .font-caprasimo { font-family: 'Caprasimo', cursive; }
      .font-emblema-one { font-family: 'Emblema One', system-ui; letter-spacing: 2px; }
      .shimmer-bg { position: relative; overflow: hidden; }
      .shimmer-bg::before { content: ''; position: absolute; top: 0; left: -150%; width: 400%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
        animation: shimmer 12s infinite linear; }
      @keyframes shimmer { 0% { transform: translateX(0); } 100% { transform: translateX(100%); } }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
  
  const WarningModal = ({ match, onCancel, onProceed, onWhitelist }) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className={`${t.card} rounded-2xl p-6 max-w-sm w-full shadow-2xl`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Shield size={22} className="text-orange-400" />
                </div>
                <h3 className={`font-bold text-lg ${t.text}`}>Safety Warning</h3>
            </div>
            <p className={`${t.textSecondary} text-sm mb-6`}>
              According to our policy, we are not responsible for actions with unverified users. It is in your best interest to only accept items from Clutch Verified members. Stay safe, let loved ones know of any updates, and be sure to call the police for suspicious activity, or our support number (470-777-2141) if support is needed. Stay safe!
            </p>
            <div className="space-y-2">
                <button onClick={onProceed} className={`w-full bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full font-semibold transition`}>
                    I Understand, Proceed
                </button>
                 <button onClick={onWhitelist} className={`w-full ${t.bgSecondary} ${t.textSecondary} p-3 rounded-full font-semibold text-xs hover:opacity-80 transition`}>
                    Proceed & Don't Warn Again for {match.name}
                </button>
                <button onClick={onCancel} className={`w-full ${t.textTertiary} p-2 rounded-full font-semibold text-xs hover:opacity-80 transition`}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
  );

  const renderScreen = () => {
    // Loading state while checking authentication
    if (loading) {
      return (
        <div className="w-full h-screen bg-gradient-to-b from-black to-pink-900 flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
            <PixelatedStarLogo className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold mb-2">Loading...</h1>
        </div>
      );
    }

    // Splash Screen
    if (currentScreen === SCREENS.SPLASH) {
    return (
        <div className={`w-full h-screen bg-gradient-to-b from-black to-pink-900 flex flex-col items-center justify-center ${t.text} p-8 text-center shimmer-bg`}>
          <div className="absolute top-6 right-6"><ThemeToggle /></div>
          <PixelatedStarLogo className="w-16 h-16 text-white mb-4" />
          <h1 className="text-5xl font-emblema-one mb-2">CLUTCH</h1>
          <p className="text-pink-200 mb-8">Feminine Help on Standby</p>
          <button onClick={() => window.location.href = '/login'} className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-caprasimo text-lg transition">Get Started</button>
      </div>
    );
  }

    // Permissions Screen
    if (currentScreen === SCREENS.PERMISSIONS) {
  return (
            <div className={`w-full h-screen ${t.bg} flex flex-col`}>
                <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6">
                    <h2 className="text-2xl font-bold">App Permissions</h2>
                     <p className="text-pink-200 text-sm mt-1">For the best experience, please enable the following:</p>
                </div>
                <div className="flex-1 p-6 space-y-4">
                    <div className={`${t.card} p-4 rounded-xl`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={24} className="text-pink-500" />
                                <div>
                                    <h3 className={`font-semibold ${t.text}`}>App Tracking</h3>
                                    <p className={`text-sm ${t.textSecondary}`}>Helps us improve app performance.</p>
                                </div>
                            </div>
                            <button className={`px-4 py-1 text-sm font-semibold rounded-full bg-pink-500 text-white`}>Allow</button>
                        </div>
                    </div>
                    <div className={`${t.card} p-4 rounded-xl`}>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <MapIcon size={24} className="text-pink-500" />
                                <div>
                                    <h3 className={`font-semibold ${t.text}`}>Location</h3>
                                    <p className={`text-sm ${t.textSecondary}`}>Finds matches and resources near you.</p>
                                </div>
                            </div>
                            <button className={`px-4 py-1 text-sm font-semibold rounded-full bg-pink-500 text-white`}>Allow</button>
        </div>
              </div>
                    <div className={`${t.card} p-4 rounded-xl`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <UserCheck size={24} className="text-pink-500" />
                    <div>
                                    <h3 className={`font-semibold ${t.text}`}>Contacts</h3>
                                    <p className={`text-sm ${t.textSecondary}`}>Identifies requests from people you know.</p>
                                </div>
                            </div>
                            <button className={`px-4 py-1 text-sm font-semibold rounded-full bg-pink-500 text-white`}>Allow</button>
                        </div>
                    </div>
                  </div>
                 <div className={`${t.card} border-t ${t.divider} p-4`}>
                    <button
                        onClick={() => navigate(SCREENS.HOME)}
                        className={`w-full p-4 rounded-full font-semibold transition bg-pink-500 hover:bg-pink-600 text-white`}
                    >
                        Finish Setup
                    </button>
                  </div>
                  </div>
        )
    }

    // Home Screen
    if (currentScreen === SCREENS.HOME) {
      return (
        <div className={`w-full h-screen ${t.bg} flex flex-col`}> 
          <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 rounded-b-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(SCREENS.PROFILE)} className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold hover:opacity-90 transition">M</button>
              <div>
                <h2 className="text-2xl font-bold mb-1">Welcome, User</h2>
                <p className="text-pink-200 text-sm">{selectedCampus}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(SCREENS.NOTIFICATIONS)} className="relative p-2 rounded-full hover:bg-white/10 transition">
                <Bell size={22} />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/10 transition" title="Logout">
                <User size={22} />
              </button>
              <ThemeToggle />
                    </div>
                  </div>
          <div className="flex-1 p-6 space-y-4">
            <div className="flex gap-4 items-stretch">
              <button 
                onClick={() => navigate(SCREENS.GIVE)} 
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg hover:shadow-xl"
              >
                <Gift size={24} /> Give
              </button>
               <button 
                onClick={() => navigate(SCREENS.REQUEST)} 
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg hover:shadow-xl"
              >
                <Plus size={24} /> Request
               </button>
            </div>
            <div className={`${t.card} p-4 rounded-2xl shadow`}> 
              <p className={`${t.textTertiary} text-sm font-semibold mb-3`}>Recent Activity</p>
              <div className="space-y-2">
                <div className={`${t.bgSecondary} p-3 rounded-lg`}><p className={`font-semibold text-sm ${t.text}`}>Requested: Period Products</p><p className={`text-xs ${t.textTertiary}`}>Request sent...</p></div>
                <div className={`${t.bgSecondary} p-3 rounded-lg`}><p className={`font-semibold text-sm ${t.text}`}>Donated: All items</p><p className={`text-xs ${t.textTertiary}`}>To Women&apos;s Center</p></div>
              </div>
            </div>
          </div>
          <div className={`${t.card} border-t ${t.divider} p-4 flex gap-3`}> 
            <button onClick={() => navigate(SCREENS.HOME)} className="flex-1 py-3 bg-black text-white rounded-full font-semibold flex flex-col items-center justify-center gap-1 hover:bg-gray-900 transition text-xs"><Home size={20} /> Home</button>
            <button onClick={() => navigate(SCREENS.COMMUNITY)} className={`flex-1 py-3 ${t.bgSecondary} ${t.textSecondary} rounded-full font-semibold flex flex-col items-center justify-center gap-1 hover:opacity-80 transition text-xs`}>
              <Users className="w-5 h-5"/> Community
            </button>
            <button onClick={() => navigate(SCREENS.MAP)} className={`flex-1 py-3 ${t.bgSecondary} ${t.textSecondary} rounded-full font-semibold flex flex-col items-center justify-center gap-1 hover:opacity-80 transition text-xs`}>
              <MapPin size={20} /> Map
            </button>
          </div>
        </div>
      );
    }

    // Screen: Give / Donate
    if (currentScreen === SCREENS.GIVE) {
      return (
        <div className={`w-full h-screen ${t.bg} flex flex-col`}> 
          <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center gap-3">
            <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
            <h2 className="text-2xl font-bold">Donate Items</h2>
                      </div>
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            <p className={`${t.textSecondary} text-sm mb-2`}>Select a verified drop-off location near you. After donating, you can update the community!</p>
            {dropOffSpots.map((spot) => (
                      <button
                key={spot.id} 
                onClick={() => handleDonation(spot)} 
                className={`w-full ${t.card} p-4 rounded-2xl shadow hover:shadow-lg transition text-left border-l-4 border-pink-500`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold ${t.text}`}>{spot.name}</p>
                    <p className={`text-xs ${t.textTertiary} flex items-center gap-1`}><MapPin size={14} /> {spot.distance}</p>
                  </div>
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                </div>
                  </button>
            ))}
          </div>
        </div>
      );
    }
    
    // Screen: Community
    if (currentScreen === SCREENS.COMMUNITY) {
        const TABS = ['Restock Updates', 'Communal Hangouts / 3rd Spaces', 'Memes & Positivity', 'Personal Stories'];
        return (
            <div className={`w-full h-screen ${t.bg} flex flex-col`}>
                <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Community Hub</h2>
                    <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><Home size={24} /></button>
                </div>
                <div className={`p-2 border-b ${t.border}`}>
                    <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
                        {TABS.map(tab => (
                  <button
                                key={tab}
                                onClick={() => setCommunityTab(tab)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition ${communityTab === tab ? 'bg-pink-500 text-white' : `${t.bgSecondary} ${t.textSecondary}`}`}
                  >
                                {tab}
                  </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {communityPosts.filter(p => p.thread === communityTab).map(post => (
                        <div key={post.id} className={`${t.card} p-4 rounded-xl shadow`}>
                            <p className={`${t.textSecondary} text-sm mb-2`}>{post.content}</p>
                            <div className="flex justify-between items-center">
                                <p className={`text-xs font-bold ${post.verified ? 'text-pink-400' : t.textTertiary}`}>
                                    {post.user} {post.verified && <Star size={12} className="inline fill-pink-400"/>}
                                </p>
                                <p className={`text-xs ${t.textTertiary}`}>{post.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={`${t.card} border-t ${t.divider} p-4 flex gap-2 items-center`}>
                    <input type="text" placeholder="Post anonymously..." className={`flex-1 ${t.input} p-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-pink-500`}/>
                    <button onClick={handleCreatePost} className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition"><Send size={20} /></button>
                </div>
              </div>
        );
    }

    // Screen: Notifications
    if (currentScreen === SCREENS.NOTIFICATIONS) {
        const TABS = ['All', 'From Contacts', 'Others'];
        const filteredNotifications = notificationsData.filter(n => {
            if (notificationTab === 'All') return n.type === 'chat_request';
            if (notificationTab === 'From Contacts') return n.isContact;
            if (notificationTab === 'Others') return !n.isContact;
            return false;
        });

        return (
            <div className={`w-full h-screen ${t.bg} flex flex-col`}>
                <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><Home size={24} /></button>
                  </div>
                <div className={`p-2 border-b ${t.border}`}>
                    <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
                        {TABS.map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setNotificationTab(tab)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition ${notificationTab === tab ? 'bg-pink-500 text-white' : `${t.bgSecondary} ${t.textSecondary}`}`}
                            >
                                {tab}
                            </button>
                        ))}
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {filteredNotifications.length > 0 ? filteredNotifications.map(notif => (
                        <div key={notif.id} className={`${t.card} p-4 rounded-xl shadow`}>
                           <p className={`${t.textSecondary} text-sm mb-3`}>
                               <span className={`font-bold ${notif.from.verified ? 'text-pink-400' : t.text}`}>{notif.from.name}</span>
                               <span> requested </span> 
                               <span className="font-bold">{notif.item}</span>.
                           </p>
                           {notif.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button onClick={() => { setSelectedChat(notif.from); navigate(SCREENS.CHAT); }} className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold p-2 rounded-full transition">Accept</button>
                                    <button className={`flex-1 ${t.bgSecondary} ${t.textSecondary} text-sm font-semibold p-2 rounded-full hover:opacity-80 transition`}>Decline</button>
                                </div>
                           )}
                           {notif.status === 'accepted' && <p className="text-sm font-semibold text-green-500">You accepted this request.</p>}
                        </div>
                    )) : <p className={`text-center ${t.textTertiary} mt-8`}>No new requests.</p>}
              </div>
            </div>
        );
    }
    
    // Screen: Request Sent
    if (currentScreen === SCREENS.REQUEST_SENT) {
        return(
            <div className={`w-full h-screen bg-gradient-to-b from-black to-pink-900 flex flex-col items-center justify-center ${t.text} p-8 text-center`}>
                <Check size={64} className="text-green-400 bg-green-400/10 p-4 rounded-full mb-6" />
                <h1 className="text-2xl font-bold mb-2">Request Sent!</h1>
                <p className={`${t.textSecondary} max-w-sm mb-8`}>Your request has been sent to {requestSentTo?.name}. You will be notified when they approve it.</p>
                <button onClick={goBack} className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-caprasimo text-lg transition">Back to Home</button>
            </div>
        )
    }

    // Request Screen
    if (currentScreen === SCREENS.REQUEST) {
        return (
          <div className={`w-full h-screen bg-gradient-to-b ${t.bg} flex flex-col`}> 
            <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center gap-3">
              <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
              <h2 className="text-2xl font-bold">What Do You Need?</h2>
            </div>
            <div className="flex-1 p-6 space-y-3">
              {['Period Products', 'Pain Relief', 'Hygiene Items', 'Other'].map((item) => (
                <button key={item} onClick={() => { setRequestItem(item); navigate(SCREENS.LOADING); }} className={`w-full ${t.card} p-4 rounded-2xl shadow hover:shadow-md transition font-semibold ${t.textSecondary} border-2 border-transparent hover:border-pink-500`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        );
    }
 
    // Loading Screen
    if (currentScreen === SCREENS.LOADING) {
        return (
            <div className={`relative w-full h-screen bg-gradient-to-b from-black to-pink-900 flex flex-col items-center justify-center ${t.text} overflow-hidden`}>
                <PixelatedStarLogo className="absolute w-32 h-32 text-white/10 top-10 left-10 animate-pulse" style={{ animationDuration: '3s' }}/>
                <PixelatedStarLogo className="absolute w-24 h-24 text-white/5 bottom-20 right-5 animate-pulse" style={{ animationDuration: '4s' }}/>
                <PixelatedStarLogo className="absolute w-48 h-48 text-white/10 top-1/2 left-1/4 animate-pulse" style={{ animationDuration: '5s' }}/>
                <div className="z-10 flex flex-col items-center p-4">
                    <PixelatedStarLogo className="w-20 h-20 text-white mb-6 animate-pulse" />
                    <h1 className="text-xl font-bold mb-2 text-center">Clutch AI is scouting the best options...</h1>
                </div>
            </div>
        );
    }

    // AI Matching Screen
    if (currentScreen === SCREENS.AI_MATCHING) {
        return (
            <AIMatchingComponent 
                itemType={requestItem}
                onMatchSelected={(match) => {
                    setSelectedMatch(match);
                    navigate(SCREENS.MATCHES);
                }}
                onBack={() => navigate(SCREENS.REQUEST)}
            />
        );
    }

    // Matches Screen (AI Curated)
    if (currentScreen === SCREENS.MATCHES && !selectedMatch) {
      const curatedMatches = allMatchesData.filter(match => match.verified);
      return (
        <div className={`w-full h-screen ${t.bg} flex flex-col`}> 
          <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center gap-3">
            <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
            <h2 className="text-2xl font-bold">Top Matches for {requestItem}</h2>
                  </div>
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            {curatedMatches.map((match) => (
              <button key={match.id} onClick={() => setSelectedMatch(match)} className={`w-full ${t.card} p-4 rounded-2xl shadow hover:shadow-lg transition text-left border-l-4 border-pink-500`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className={`font-bold ${t.text}`}>{match.name}</p>
                    <p className={`text-xs ${t.textTertiary} flex items-center gap-1`}><MapPin size={14} /> {match.distance}</p>
                  </div>
                  {match.verified && <Star size={18} className="text-yellow-400 fill-yellow-400" />}
                </div>
                <p className={`text-sm ${t.textSecondary}`}>{match.items}</p>
              </button>
                    ))}
                  </div>
          <div className={`p-4 border-t ${t.divider}`}>
              <button onClick={() => navigate(SCREENS.ALL_MATCHES)} className={`w-full text-center text-sm font-semibold ${t.textSecondary} hover:text-pink-400 transition`}>
                  Want other options? Click here
              </button>
                  </div>
                </div>
      );
    }
    
    // All Matches Screen
    if (currentScreen === SCREENS.ALL_MATCHES && !selectedMatch) {
        return (
          <div className={`w-full h-screen ${t.bg} flex flex-col`}> 
            <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center gap-3">
              <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
              <h2 className="text-2xl font-bold">All Matches for {requestItem}</h2>
            </div>
            <div className="flex-1 p-6 space-y-3 overflow-y-auto">
              {allMatchesData.map((match) => (
                <button
                  key={match.id}
                  onClick={() => {
                    if (!match.verified && !whitelistedUsers.includes(match.id)) {
                      setShowWarning(match);
                    } else {
                      setSelectedMatch(match);
                    }
                  }}
                  className={`w-full ${t.card} p-4 rounded-2xl shadow hover:shadow-lg transition text-left border-l-4 ${match.verified ? 'border-pink-500' : 'border-gray-500'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`font-bold ${t.text}`}>{match.name}</p>
                      <p className={`text-xs ${t.textTertiary} flex items-center gap-1`}><MapPin size={14} /> {match.distance}</p>
                    </div>
                    {match.verified && <Star size={18} className="text-yellow-400 fill-yellow-400" />}
                  </div>
                  <p className={`text-sm ${t.textSecondary}`}>{match.items}</p>
                </button>
              ))}
            </div>
          </div>
        );
    }

    // Match Detail Screen
    if (selectedMatch) {
      const isRequestSent = sentRequests.includes(selectedMatch.id);
      return (
        <div className={`w-full h-screen ${t.bg} flex flex-col`}> 
          <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center gap-3">
            <button onClick={() => setSelectedMatch(null)} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
            <h2 className="text-xl font-bold">{selectedMatch.name}</h2>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className={`${t.card} p-6 rounded-2xl shadow space-y-4`}> 
              <div>
                <p className={`${t.textTertiary} text-sm font-semibold mb-1`}>Distance</p>
                <p className={`text-2xl font-bold ${t.text} flex items-center gap-2`}><Navigation size={20} /> {selectedMatch.distance}</p>
              </div>
              <div>
                <p className={`${t.textTertiary} text-sm font-semibold mb-1`}>Verification</p>
                <p className="flex items-center gap-2">
                  {selectedMatch.verified ? (<><Check size={18} className="text-green-500" /> <span className="text-green-600 dark:text-green-400 font-semibold">Verified</span></>) : 
                  (<><X size={18} className="text-orange-500" /> <span className="text-orange-600 dark:text-orange-400 font-semibold">Unverified</span></>)}
                </p>
            </div>
              <div>
                <p className={`${t.textTertiary} text-sm font-semibold mb-1`}>Available Items</p>
                <p className={t.textSecondary}>{selectedMatch.items}</p>
              </div>
              <p className={`text-xs ${t.textTertiary}`}>All interactions are anonymous and safe. Never share personal details.</p>
            </div>
          </div>
          <div className={`${t.card} border-t ${t.divider} p-4 space-y-2`}> 
              <button
                onClick={() => handleStartChat(selectedMatch)} 
                disabled={isRequestSent}
                className={`w-full p-4 rounded-full font-caprasimo text-lg flex items-center justify-center gap-2 transition ${
                    isRequestSent 
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                }`}
            >
                {isRequestSent ? 'Request Sent' : 'Start Chat'}
              </button>
            <button onClick={() => setSelectedMatch(null)} className={`w-full ${t.bgSecondary} hover:opacity-80 ${t.textSecondary} p-4 rounded-full font-semibold transition`}>Back</button>
          </div>
        </div>
      );
    }

    // Chat Screen
    if (selectedChat) {
        return (
          <div className={`w-full h-screen ${t.bgSecondary} flex flex-col`}> 
            <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center gap-3">
              <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
              <div><h2 className="text-xl font-bold">{selectedChat.name}</h2><p className="text-xs text-pink-200">Arrange exchange | Chat is encrypted</p></div>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-3 rounded-2xl rounded-tl-none w-3/4`}><p className={`text-sm ${darkMode ? 'text-blue-100' : 'text-gray-900'}`}>Hi, I need period products</p></div>
              <div className={`${darkMode ? 'bg-pink-900' : 'bg-pink-100'} p-3 rounded-2xl rounded-tr-none w-3/4 ml-auto`}><p className={`text-sm ${darkMode ? 'text-pink-100' : 'text-gray-900'}`}>I have tampons and pads available! We can meet at the Women&apos;s Center or I can drop off at your dorm.</p></div>
            </div>
            <div className={`${t.card} border-t ${t.divider} p-4 flex gap-2`}> 
              <input type="text" placeholder="Type message..." className={`flex-1 ${t.input} p-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-pink-500`}/>
              <button className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition"><MessageSquare size={20} /></button>
                        </div>
                      </div>
        );
    }

    // Map Screen
    if (currentScreen === SCREENS.MAP) {
      return (
        <div className={`w-full h-screen ${t.bg} flex flex-col`}> 
          <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center gap-3 z-10">
            <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
            <h2 className="text-2xl font-bold">Nearby Providers</h2>
          </div>
          <div className="flex-1 relative min-h-[400px]">
            <div className="absolute top-0 left-0 right-0 p-2 text-white text-center text-sm z-20 pointer-events-none">
                <span className="bg-black/50 px-3 py-1 rounded-full">Click anywhere on the map to flag a new location!</span>
            </div>
            <div className="w-full h-full">
              <PigeonMap />
            </div>
                    </div>
                  </div>
      );
    }

    // Profile Screen
    if (currentScreen === SCREENS.PROFILE) {
        return (
          <div className={`w-full h-screen bg-gradient-to-b ${t.bg} flex flex-col`}> 
            <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
                <h2 className="text-2xl font-bold">My Profile</h2>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/10 transition" title="Logout">
                <User size={22} />
              </button>
            </div>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className={`${t.card} p-6 rounded-2xl shadow text-center`}> 
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl">M</div>
                <p className={`font-bold text-lg ${t.text}`}>Maya Johnson</p>
                <div className="relative mt-2">
                    <select
                        value={selectedCampus}
                        onChange={(e) => setSelectedCampus(e.target.value)}
                        className={`w-full appearance-none ${t.input} ${t.textSecondary} text-sm font-semibold p-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-pink-500`}
                    >
                        {GSU_CAMPUSES.map(campus => (
                            <option key={campus} value={campus}>{campus}</option>
                        ))}
                    </select>
                    <ChevronRight size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.textTertiary} pointer-events-none`} />
                </div>
                <p className="flex items-center justify-center gap-1 text-yellow-500 mt-4"><Star size={16} className="fill-yellow-400" /> Verified</p>
              </div>
              <div className={`${t.card} p-4 rounded-2xl shadow`}> 
                <p className={`font-semibold ${t.text} mb-3`}>Stats</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className={`${t.bgSecondary} p-3 rounded-lg`}><p className="text-2xl font-bold text-pink-500">5</p><p className={`text-xs ${t.textTertiary}`}>Requests</p></div>
                  <div className={`${t.bgSecondary} p-3 rounded-lg`}><p className="text-2xl font-bold text-pink-500">8</p><p className={`text-xs ${t.textTertiary}`}>Helped</p></div>
                  <div className={`${t.bgSecondary} p-3 rounded-lg`}><p className="text-2xl font-bold text-pink-500">12</p><p className={`text-xs ${t.textTertiary}`}>Donated</p></div>
                        </div>
                      </div>
               <button className={`w-full ${t.card} p-4 rounded-2xl shadow font-semibold ${t.textSecondary} ${t.cardHover} transition flex justify-between items-center`}><span><Award size={20} className="inline mr-2" />My Coupons</span><ChevronRight size={20} /></button>
              <button onClick={() => navigate(SCREENS.SETTINGS)} className={`w-full ${t.card} p-4 rounded-2xl shadow font-semibold ${t.textSecondary} ${t.cardHover} transition flex justify-between items-center`}><span><SettingsIcon size={20} className="inline mr-2" />Settings</span><ChevronRight size={20} /></button>
                    </div>
                  </div>
        );
    }

    // Settings Screen
    if (currentScreen === SCREENS.SETTINGS) {
        return (
          <div className={`w-full h-screen ${t.bg} flex flex-col`}>
            <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
                <h2 className="text-2xl font-bold">Settings</h2>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/10 transition" title="Logout">
                <User size={22} />
              </button>
            </div>
            <div className="flex-1 p-6 space-y-3">
               <button onClick={() => navigate(SCREENS.POLICIES)} className={`w-full text-left ${t.card} p-4 rounded-xl shadow ${t.cardHover} transition flex justify-between items-center`}><p>Policies & Safety</p><ChevronRight size={20} /></button>
              <button className={`w-full text-left ${t.card} p-4 rounded-xl shadow ${t.cardHover} transition flex justify-between items-center`}><p>Account Info</p><ChevronRight size={20} /></button>
              <button className={`w-full text-left ${t.card} p-4 rounded-xl shadow ${t.cardHover} transition flex justify-between items-center`}><p>School Info</p><ChevronRight size={20} /></button>
              <button onClick={() => navigate(SCREENS.AI_PERMISSIONS)} className={`w-full text-left ${t.card} p-4 rounded-xl shadow ${t.cardHover} transition flex justify-between items-center`}><p>AI Permissions</p><ChevronRight size={20} /></button>
                        </div>
                      </div>
        );
    }

    // Screen: Policies
    if (currentScreen === SCREENS.POLICIES) {
        return (
            <div className={`w-full h-screen ${t.bg} flex flex-col`}>
                <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center gap-3">
                    <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
                    <h2 className="text-2xl font-bold">Policies & Safety</h2>
                </div>
                <div className="flex-1 p-6 space-y-6 overflow-y-auto text-sm">
                    <div className={`${t.card} p-4 rounded-xl`}>
                        <h3 className={`font-bold text-lg mb-2 ${t.text}`}>Conduct Rules</h3>
                        <ul className={`list-disc list-inside space-y-1 ${t.textSecondary}`}>
                            <li>No hate speech, harassment, or bullying.</li>
                            <li>No explicit, graphic, or inappropriate content.</li>
                            <li>Respect privacy: no sharing of personal data.</li>
                            <li>Users under 20 remain anonymous by default.</li>
                            <li>Chat requests must be accepted by verified users only.</li>
                        </ul>
                    </div>
                     <div className={`${t.card} p-4 rounded-xl`}>
                        <h3 className={`font-bold text-lg mb-2 ${t.text}`}>Verification & Partners</h3>
                        <p className={`${t.textSecondary}`}>Verification requires a valid GSU student email or official ID to ensure community safety. Our partners are verified 3rd spaces, women-led stores, and community organizations. Verified users get access to exclusive coupons.</p>
                  </div>
                     <div className={`${t.card} p-4 rounded-xl`}>
                        <h3 className={`font-bold text-lg mb-2 ${t.text}`}>Legal Disclaimer</h3>
                        <p className={`${t.textSecondary}`}>CLUTCH connects users to safe resources and verified locations but is not responsible for in-person exchanges that occur outside of these designated safe spots. We adhere to COPPA and FERPA protections for minors and student data.</p>
                    </div>
                    <a href="https://www.gofundme.com" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full font-semibold transition">
                        Support Us on GoFundMe
                    </a>
                </div>
              </div>
        );
    }
 
    if (currentScreen === SCREENS.AI_PERMISSIONS) {
        return (
          <div className={`w-full h-screen ${t.bg} flex flex-col`}>
            <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center gap-3">
              <button onClick={goBack} className="hover:bg-pink-800 p-2 rounded-full transition"><ArrowLeft size={24} /></button>
              <h2 className="text-2xl font-bold">AI Permissions</h2>
            </div>
            <div className="flex-1 p-6 space-y-4">
                <div className={`${t.card} p-4 rounded-xl shadow`}>
                    <div className="flex justify-between items-center">
                  <div>
                            <p className={`font-semibold ${t.text}`}>Enable AI Matching</p>
                            <p className={`text-sm ${t.textTertiary}`}>Allow Clutch AI to find the best matches for you.</p>
                  </div>
                        <button onClick={() => setAiPermissions(!aiPermissions)} className={`w-14 h-8 rounded-full p-1 transition-colors ${aiPermissions ? 'bg-pink-500' : t.bgSecondary}`}>
                            <span className={`block w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${aiPermissions ? 'translate-x-6' : ''}`} />
                  </button>
                  </div>
              </div>
            </div>
          </div>
        );
    }

    return null;
  }

  return (
    <>
      <AppStyles />
      {renderScreen()}
      {showWarning && (
          <WarningModal 
              match={showWarning}
              onCancel={() => setShowWarning(null)}
              onProceed={() => {
                  setSelectedMatch(showWarning);
                  setShowWarning(null);
              }}
              onWhitelist={() => {
                  setWhitelistedUsers([...whitelistedUsers, showWarning.id]);
                  setSelectedMatch(showWarning);
                  setShowWarning(null);
              }}
          />
      )}
    </>
  );
}