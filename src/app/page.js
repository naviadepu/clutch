'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Timer, Mail, Lock } from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const ClutchAuthPage = () => {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, profile, addRequest, community, help

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Mock user data
  const userData = {
    name: "Sarah Johnson",
    avatar: <img src="/ClutchIcons/user.png" alt="User" className="w-28 h-28" />,
    helpedCount: 23,
    requestedItems: ["Period Products", "Cosmetics", "Medication"],
    activePairings: 2
  };

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        router.push('/signup'); // Redirect to signup first
      }
    });

    return () => unsubscribe();
  }, [router]);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    if (showMap && !userLocation) {
      requestLocation();
    }
  }, [showMap, userLocation]);

  // Initialize map when location is available
  useEffect(() => {
    if (showMap && userLocation && typeof window !== 'undefined') {
      // Dynamically load Leaflet CSS and JS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setTimeout(() => {
          const mapContainer = document.getElementById('map');
          if (mapContainer && window.L) {
            // Clear any existing map
            mapContainer.innerHTML = '';

            // Create map
            const map = window.L.map('map').setView([userLocation.lat, userLocation.lng], 15);

            // Add tile layer
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add marker
            window.L.marker([userLocation.lat, userLocation.lng])
              .addTo(map)
              .bindPopup('Your Location')
              .openPopup();
          }
        }, 100);
      };
      document.head.appendChild(script);
    }
  }, [showMap, userLocation]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50/50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // If no user, redirect to signup (this should not show due to useEffect redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-pink-50/50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md p-2 sm:p-4 flex items-center justify-center sticky top-0 z-50 overflow-x-auto">
        <div className="flex items-center space-x-2 sm:space-x-6 min-w-max">
          <button onClick={() => setCurrentView('dashboard')}>
            <img src="/ClutchIcons/star.ico" className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
          </button>
          <button
            onClick={() => setShowMap(true)}
            className="px-1 sm:px-3 py-1 text-xs sm:text-sm text-gray-700 hover:text-pink-600 transition duration-150 flex flex-col items-center"
          >
            <img src="/ClutchIcons/location.png" alt="Location" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xs hidden sm:inline">Map</span>
          </button>
          <button
            onClick={() => setCurrentView('community')}
            className="px-1 sm:px-3 py-1 text-xs sm:text-sm text-gray-700 hover:text-pink-600 transition duration-150 flex flex-col items-center"
          >
            <img src="/ClutchIcons/chat.png" alt="Chat" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xs hidden sm:inline">Community</span>
          </button>
          <button
            onClick={() => setCurrentView('addRequest')}
            className="px-1 sm:px-3 py-1 text-xs sm:text-sm text-gray-700 hover:text-pink-600 transition duration-150 flex flex-col items-center"
          >
            <img src="/ClutchIcons/add.png" alt="Add" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xs hidden sm:inline">Add Request</span>
          </button>
          <button
            onClick={() => setCurrentView('help')}
            className="px-1 sm:px-3 py-1 text-xs sm:text-sm text-gray-700 hover:text-pink-600 transition duration-150 flex flex-col items-center"
          >
            <img src="/ClutchIcons/caution.png" alt="Help" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xs hidden sm:inline">Help</span>
          </button>
          <button
            onClick={() => setCurrentView('profile')}
            className="px-1 sm:px-3 py-1 text-xs sm:text-sm text-gray-700 hover:text-pink-600 transition duration-150 flex flex-col items-center"
          >
            <img src="/ClutchIcons/user.png" alt="User" className="h-8 w-8 sm:h-12 sm:w-12" />
            <span className="text-xs hidden sm:inline">You</span>
          </button>
          <button
            onClick={async () => {
              try {
                await signOut(auth);
                router.push('/signup');
              } catch (error) {
                console.error('Error signing out:', error);
              }
            }}
            className="px-1 sm:px-3 py-1 text-gray-700 hover:text-pink-600 text-xs sm:text-sm rounded-lg transition duration-150 flex flex-col items-center"
          >
            <img src="/ClutchIcons/logout.png" alt="Logout" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xs hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow relative">
        {/* Map Modal - Positioned over content but below navbar */}
        {showMap && (
          <div className="fixed inset-0 top-[72px] bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl h-[calc(100vh-120px)] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Map View</h2>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-gray-50 border-b">
                {userLocation ? (
                  <div className="text-sm flex items-center space-x-2">
                    <img src="/ClutchIcons/location.png" alt="Location" className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-green-600">Location Found</p>
                      <p className="text-gray-600">
                        Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Accuracy: ±{Math.round(userLocation.accuracy)}m
                      </p>
                    </div>
                  </div>
                ) : locationError ? (
                  <div className="text-sm">
                    <p className="font-medium text-red-600">❌ Location Error</p>
                    <p className="text-gray-600">{locationError}</p>
                    <button
                      onClick={requestLocation}
                      className="mt-2 px-3 py-1 bg-pink-500 text-white text-xs rounded hover:bg-pink-600"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    🔄 Requesting your location...
                  </div>
                )}
              </div>

              <div className="flex-1 relative">
                {userLocation ? (
                  <div id="map" className="w-full h-full"></div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center text-gray-500">
                      <img src="/ClutchIcons/location.png" alt="Location" className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Waiting for location access...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="p-6 text-center text-gray-600">

          {/* DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Dashboard</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Mini Map Widget */}
                <div className="bg-white rounded-xl shadow-lg border border-pink-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4 text-pink-700">Your Location</h3>
                  <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center mb-4">
                    {userLocation ? (
                      <div className="text-center">
                        <img src="/ClutchIcons/location.png" alt="Location" className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°
                        </p>
                        <p className="text-xs text-pink-600 mt-2">
                          {userData.activePairings} Active Pairings
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={requestLocation}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                      >
                        Enable Location
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setShowMap(true)}
                    className="w-full px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition"
                  >
                    View Full Map
                  </button>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => setCurrentView('profile')}
                    className="bg-white rounded-xl shadow-lg border border-pink-200 p-4 sm:p-6 hover:shadow-xl transition flex flex-col items-center justify-center"
                  >
                    <div className="text-3xl sm:text-4xl mb-2"><img src="/ClutchIcons/user.png" alt="User" className="h-12 w-12 sm:h-16 sm:w-16" /></div>
                    <p className="font-medium text-pink-700 text-sm sm:text-base">My Profile</p>
                  </button>

                  <button
                    onClick={() => setCurrentView('addRequest')}
                    className="bg-white rounded-xl shadow-lg border border-pink-200 p-4 sm:p-6 hover:shadow-xl transition flex flex-col items-center justify-center"
                  >
                    <img src="/ClutchIcons/chat.png" alt="Add Request" className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
                    <p className="font-medium text-pink-700 text-sm sm:text-base">Add Request</p>
                  </button>

                  <button
                    onClick={() => setCurrentView('community')}
                    className="bg-white rounded-xl shadow-lg border border-pink-200 p-4 sm:p-6 hover:shadow-xl transition flex flex-col items-center justify-center"
                  >
                    <div className="text-3xl sm:text-4xl mb-2">💬</div>
                    <p className="font-medium text-pink-700 text-sm sm:text-base">Community</p>
                  </button>

                  <button
                    onClick={() => setCurrentView('help')}
                    className="bg-white rounded-xl shadow-lg border border-pink-200 p-4 sm:p-6 hover:shadow-xl transition flex flex-col items-center justify-center"
                  >
                    <div className="text-3xl sm:text-4xl mb-2">❓</div>
                    <p className="font-medium text-pink-700 text-sm sm:text-base">Help</p>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-lg border border-pink-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4 text-pink-700">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <span className="text-sm">Helped Emily with period products</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <span className="text-sm">Received cosmetics from Sarah</span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE VIEW */}
          {currentView === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

              <div className="bg-white rounded-xl shadow-lg border border-pink-200 p-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="text-8xl mb-4">{userData.avatar}</div>
                  <h3 className="text-2xl font-bold text-gray-800">{userData.name}</h3>
                  <p className="text-gray-500">University Student</p>
                  <p className="text-sm text-gray-400 mt-1">{user.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-pink-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-pink-600">{userData.helpedCount}</p>
                    <p className="text-sm text-gray-600">People Helped</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-pink-600">{userData.requestedItems.length}</p>
                    <p className="text-sm text-gray-600">Items Requested</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-pink-600">{userData.activePairings}</p>
                    <p className="text-sm text-gray-600">Active Pairings</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-lg mb-3 text-pink-700">Requested Items History</h4>
                  <div className="space-y-2">
                    {userData.requestedItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">{item}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="w-full mt-6 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* ADD REQUEST VIEW */}
          {currentView === 'addRequest' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">What do you need?</h2>

              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <button className="bg-white rounded-xl shadow-lg border border-pink-200 p-8 hover:shadow-xl hover:border-pink-400 transition">
                  <div className="text-6xl mb-4">🩸</div>
                  <h3 className="text-xl font-semibold text-pink-700">Period Products</h3>
                  <p className="text-sm text-gray-500 mt-2">Pads, tampons, etc.</p>
                </button>

                <button className="bg-white rounded-xl shadow-lg border border-pink-200 p-8 hover:shadow-xl hover:border-pink-400 transition">
                  <div className="text-6xl mb-4">💊</div>
                  <h3 className="text-xl font-semibold text-pink-700">Contraception</h3>
                  <p className="text-sm text-gray-500 mt-2">Birth control, condoms</p>
                </button>

                <button className="bg-white rounded-xl shadow-lg border border-pink-200 p-8 hover:shadow-xl hover:border-pink-400 transition">
                  <div className="text-6xl mb-4">💄</div>
                  <h3 className="text-xl font-semibold text-pink-700">Cosmetics</h3>
                  <p className="text-sm text-gray-500 mt-2">Makeup, skincare</p>
                </button>

                <button className="bg-white rounded-xl shadow-lg border border-pink-200 p-8 hover:shadow-xl hover:border-pink-400 transition">
                  <div className="text-6xl mb-4">💉</div>
                  <h3 className="text-xl font-semibold text-pink-700">Medication</h3>
                  <p className="text-sm text-gray-500 mt-2">OTC medicines</p>
                </button>
              </div>

              <button
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          )}

          {/* COMMUNITY VIEW */}
          {currentView === 'community' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">Community Chats</h2>

              <div className="bg-white rounded-xl shadow-lg border border-pink-200">
                {/* Chat List */}
                <div className="divide-y">
                  <div className="p-4 hover:bg-pink-50 cursor-pointer transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">👤</div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">Emily Chen</p>
                          <p className="text-sm text-gray-500">Thanks for the help! Really appreciate it 💕</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">2h</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-pink-50 cursor-pointer transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">👤</div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">Sarah Martinez</p>
                          <p className="text-sm text-gray-500">Do you still need those cosmetics?</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">5h</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-pink-50 cursor-pointer transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">👤</div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">Jessica Lee</p>
                          <p className="text-sm text-gray-500">Meeting at the library in 10 mins?</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">1d</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-pink-50 cursor-pointer transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">👥</div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">Campus Support Group</p>
                          <p className="text-sm text-gray-500">New member joined the group!</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">2d</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {/* HELP VIEW */}
          {currentView === 'help' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">Help & Support</h2>

              <div className="bg-white rounded-xl shadow-lg border border-pink-200 p-8">
                <h3 className="text-xl font-semibold mb-4 text-pink-700">Report an Issue</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What would you like to report?
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500">
                      <option>Select an issue type</option>
                      <option>Inappropriate behavior</option>
                      <option>Safety concern</option>
                      <option>Technical issue</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe the issue
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      rows="5"
                      placeholder="Please provide details about the issue..."
                    ></textarea>
                  </div>

                  <button className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                    Submit Report
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t">
                  <h4 className="font-semibold mb-3">Need immediate help?</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📞 Campus Safety: (555) 123-4567</p>
                    <p>📧 Support Email: support@clutch.edu</p>
                    <p>🏥 Health Services: Building A, Room 101</p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="w-full mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ClutchAuthPage;