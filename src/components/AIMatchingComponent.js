import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Star, CheckCircle, Clock, Users, BrainCircuit } from 'lucide-react';

const AIMatchingComponent = ({ itemType, onMatchSelected, onBack }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    findMatches();
  }, [itemType, findMatches]);

  const findMatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'findMatches',
          data: {
            itemType: itemType,
            location: { lat: 33.7756, lng: -84.3963 }, // Atlanta area
            description: `Looking for ${itemType.toLowerCase()}`
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMatches(data.matches || []);
        setDebugInfo({
          totalMatches: data.totalMatches,
          searchTime: new Date().toLocaleTimeString()
        });
      } else {
        console.error('Failed to find matches:', data.error);
        setMatches([]);
      }
    } catch (error) {
      console.error('Error finding matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [itemType]);

  const MatchCard = ({ match, index }) => (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-pink-500 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
            {match.providerProfile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{match.providerProfile.name}</h3>
            <p className="text-sm text-gray-400">{match.providerProfile.university}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {match.providerProfile.isVerified && (
            <CheckCircle className="h-5 w-5 text-green-400" />
          )}
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        </div>
      </div>

      {/* Item Details */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-white mb-2">{match.item.description}</h4>
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span>Condition: {match.item.condition}</span>
          <span>Qty: {match.item.quantity}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">{match.distance.toFixed(1)}km</div>
          <p className="text-xs text-gray-500">Distance</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">{match.compatibilityScore}%</div>
          <p className="text-xs text-gray-500">Compatibility</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">{match.estimatedMeetTime}m</div>
          <p className="text-xs text-gray-500">Est. Time</p>
        </div>
      </div>

      {/* Provider stats */}
      <div className="bg-gray-700 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-gray-300">Helped {match.providerProfile.helpedCount} people</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-gray-300">Avg. {match.providerProfile.avgResponseTime}m response</span>
          </div>
        </div>
        <div className="text-xs text-gray-400 mb-2">
          &quot;{match.providerProfile.bio}&quot;
        </div>
        {match.providerProfile.isVerified && (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-400 font-medium">Verified User</span>
          </div>
        )}
      </div>

      {/* AI Insights */}
      {match.aiInsights && (
        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3 mb-4">
          <h5 className="font-semibold text-purple-300 mb-2 flex items-center">
            <BrainCircuit className="h-4 w-4 mr-2" />
            AI Insights
          </h5>
          <p className="text-sm text-purple-200">{match.aiInsights}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => onMatchSelected(match)}
          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Connect
        </button>
        <button className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition-colors duration-200">
          View Profile
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-black to-pink-900 flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
            <BrainCircuit className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Clutch AI is working...</h1>
          <p className="text-pink-200">Finding the best matches for {itemType}</p>
          <div className="mt-4 w-64 bg-gray-700 rounded-full h-2">
            <div className="bg-pink-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-pink-900 text-white p-6 flex items-center gap-3">
        <button onClick={onBack} className="hover:bg-pink-800 p-2 rounded-full transition">
          ←
        </button>
        <div>
          <h2 className="text-2xl font-bold">AI Matches for {itemType}</h2>
          <p className="text-pink-200 text-sm">
            {matches.length} matches found • Enhanced with AI insights
          </p>
        </div>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Total matches: {debugInfo.totalMatches}</span>
            <span>Last updated: {debugInfo.searchTime}</span>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {matches.length > 0 ? (
          matches.map((match, index) => (
            <MatchCard key={match.itemId || index} match={match} index={index} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <BrainCircuit className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
            <p className="text-gray-400 mb-6">
              We couldn&apos;t find any available {itemType.toLowerCase()} in your area.
            </p>
            <button
              onClick={findMatches}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMatchingComponent;
