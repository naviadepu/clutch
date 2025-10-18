'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, Users, CheckCircle, XCircle } from 'lucide-react';

const MatchCard = ({ match, onAccept, onReject, isLoading }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-pink-200 p-6 hover:shadow-xl transition-all duration-300">
      {/* Header with provider info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {match.providerProfile.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{match.providerProfile.name}</h3>
            <p className="text-sm text-gray-500">{match.providerProfile.university}</p>
            <p className="text-xs text-gray-400">{match.providerProfile.major}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(match.finalScore)}`}>
          {getScoreLabel(match.finalScore)}
        </div>
      </div>

      {/* Item details */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">{match.item.itemType}</h4>
        <p className="text-sm text-gray-600 mb-2">{match.item.description}</p>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
            Qty: {match.item.quantity}
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {match.item.condition}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Submitted {Math.floor((Date.now() - match.item.submittedAt) / (1000 * 60 * 60))} hours ago
        </div>
      </div>

      {/* Match metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <MapPin className="h-4 w-4 text-pink-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">{match.distance.toFixed(1)} km</span>
          </div>
          <p className="text-xs text-gray-500">Distance</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">{match.estimatedMeetTime}m</span>
          </div>
          <p className="text-xs text-gray-500">Est. Time</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">{match.compatibilityScore}%</span>
          </div>
          <p className="text-xs text-gray-500">Compatibility</p>
        </div>
      </div>

      {/* Provider stats */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-600">Helped {match.providerProfile.helpedCount} people</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-600">Avg. {match.providerProfile.avgResponseTime}m response</span>
          </div>
        </div>
        <div className="text-xs text-gray-600 mb-2">
          &quot;{match.providerProfile.bio}&quot;
        </div>
        {match.providerProfile.isVerified && (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">Verified User</span>
          </div>
        )}
      </div>

      {/* AI Insights */}
      {match.aiInsights && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
          <h5 className="font-semibold text-purple-800 mb-2 flex items-center">
            🤖 AI Insights
          </h5>
          <p className="text-sm text-purple-700">{match.aiInsights}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => onAccept(match)}
          disabled={isLoading}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Accept Match
        </button>
        <button
          onClick={() => onReject(match)}
          disabled={isLoading}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Decline
        </button>
      </div>
    </div>
  );
};

const AIMatchingInterface = ({ userId, userLocation, onMatchAccepted }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [debugData, setDebugData] = useState(null);

  const itemTypes = [
    { id: 'Period Products', emoji: '🩸', color: 'pink' },
    { id: 'Contraception', emoji: '💊', color: 'purple' },
    { id: 'Cosmetics', emoji: '💄', color: 'rose' },
    { id: 'Medication', emoji: '💉', color: 'blue' }
  ];

  const findMatches = async (itemType) => {
    if (!userLocation) {
      alert('Location is required for matching. Please enable location services.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'findMatches',
          data: {
            requestData: {
              id: `req_${Date.now()}`,
              userId: userId || 'test_user',
              itemType: itemType,
              location: userLocation,
              timestamp: Date.now()
            }
          }
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMatches(result.matches);
        setSelectedItemType(itemType);
        setDebugInfo({
          totalMatches: result.totalMatches,
          itemType: itemType,
          userLocation: userLocation
        });
      } else {
        console.error('Failed to find matches:', result.error);
        setMatches([]);
      }
    } catch (error) {
      console.error('Error finding matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const getDebugData = async () => {
    try {
      const response = await fetch('/api/ai-matching?action=debug');
      const result = await response.json();
      if (result.success) {
        setDebugData(result.debug);
        console.log('Debug data:', result.debug);
      }
    } catch (error) {
      console.error('Error getting debug data:', error);
    }
  };

  const handleAcceptMatch = async (match) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'acceptMatch',
          data: {
            matchId: match.itemId,
            userId: userId
          }
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Remove the accepted match from the list
        setMatches(prev => prev.filter(m => m.itemId !== match.itemId));
        onMatchAccepted && onMatchAccepted(match);
        alert(`Match accepted! You can now contact ${match.providerProfile.name}.`);
      } else {
        alert('Failed to accept match. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting match:', error);
      alert('Error accepting match. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectMatch = async (match) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'rejectMatch',
          data: {
            matchId: match.itemId,
            userId: userId
          }
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Remove the rejected match from the list
        setMatches(prev => prev.filter(m => m.itemId !== match.itemId));
      }
    } catch (error) {
      console.error('Error rejecting match:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-pink-700 mb-2">🤖 AI Matching</h2>
        <p className="text-gray-600">Find the perfect match based on distance, compatibility, and availability</p>
        <button
          onClick={getDebugData}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
        >
          🔍 Debug Data
        </button>
      </div>

      {/* Item type selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">What do you need?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {itemTypes.map((item) => (
            <button
              key={item.id}
              onClick={() => findMatches(item.id)}
              disabled={loading}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedItemType === item.id
                  ? `border-${item.color}-400 bg-${item.color}-50`
                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
            >
              <div className="text-4xl mb-2">{item.emoji}</div>
              <p className="font-medium text-gray-700">{item.id}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding your perfect matches...</p>
        </div>
      )}

      {/* Debug Info */}
      {debugInfo && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">🔍 Debug Information</h4>
          <div className="text-sm text-blue-700">
            <p><strong>Item Type:</strong> {debugInfo.itemType}</p>
            <p><strong>Total Matches Found:</strong> {debugInfo.totalMatches}</p>
            <p><strong>Your Location:</strong> {debugInfo.userLocation.lat.toFixed(4)}, {debugInfo.userLocation.lng.toFixed(4)}</p>
            <p><strong>Matches Displayed:</strong> {matches.length}</p>
          </div>
        </div>
      )}

      {/* Debug Data */}
      {debugData && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">📊 System Debug Data</h4>
          <div className="text-sm text-green-700">
            <p><strong>User Profiles:</strong> {debugData.userProfiles}</p>
            <p><strong>Available Items:</strong> {debugData.availableItems}</p>
            <p><strong>Active Requests:</strong> {debugData.activeRequests}</p>
            <details className="mt-2">
              <summary className="cursor-pointer font-medium">View All Items</summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                {JSON.stringify(debugData.allItems, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {/* Matches display */}
      {!loading && matches.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Found {matches.length} matches for {selectedItemType}
          </h3>
          <div className="space-y-4">
            {matches.map((match) => (
              <MatchCard
                key={match.itemId}
                match={match}
                onAccept={handleAcceptMatch}
                onReject={handleRejectMatch}
                isLoading={isProcessing}
              />
            ))}
          </div>
        </div>
      )}

      {/* No matches */}
      {!loading && matches.length === 0 && selectedItemType && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No matches found</h3>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find any available {selectedItemType.toLowerCase()} in your area right now.
          </p>
          <button
            onClick={() => findMatches(selectedItemType)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Instructions */}
      {!loading && matches.length === 0 && !selectedItemType && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to find your match?</h3>
          <p className="text-gray-600">
            Select an item type above to start the AI matching process. We&apos;ll find the best matches based on:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-pink-50 rounded-lg p-4">
              <MapPin className="h-8 w-8 text-pink-500 mx-auto mb-2" />
              <h4 className="font-semibold text-pink-700">Distance</h4>
              <p className="text-sm text-gray-600">Find people nearby</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-700">Compatibility</h4>
              <p className="text-sm text-gray-600">Match with similar profiles</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-700">Availability</h4>
              <p className="text-sm text-gray-600">Quick response times</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatchingInterface;
