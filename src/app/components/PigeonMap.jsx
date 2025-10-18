'use client';

import { useState, useEffect } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
import UserLocationMarker from './UserLocationMarker'; // Imports your custom "You are here!" icon

export default function PigeonMap() {
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState([33.7533, -84.3863]); // Centered on GSU
  const [zoom, setZoom] = useState(16);
  const [userLocation, setUserLocation] = useState(null);

  // This effect runs once when the component loads
  useEffect(() => {
    // 1. Fetch the initial list of locations
    fetch('/data/locations.json')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error("Failed to fetch locations:", err));

    // 2. Try to get the user's current location from the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.warn("Could not get user location:", error.message);
        }
      );
    }
  }, []); // The empty array ensures this effect only runs on the initial render

  // This function is called when a user clicks on the map
  const handleMapClick = ({ latLng }) => {
    const newLocationName = prompt("Please enter location and items available as [location, items: a, b, c]:");

    // If the user entered a name, add a new temporary marker to the map
    if (newLocationName && newLocationName.trim() !== '') {
      const newLocation = {
        id: `new-${Date.now()}`,
        name: newLocationName,
        position: [latLng[0], latLng[1]],
        items: ["User Submitted"],
      };
      setLocations(currentLocations => [...currentLocations, newLocation]);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* On-screen instructions for the user */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <p className="text-center text-white text-lg font-semibold shadow-lg">Click anywhere on the map to flag a new location!</p>
      </div>

      {/* The main map container */}
      <Map 
        height="100%" 
        width="100%"
        center={center} 
        zoom={zoom} 
        onBoundsChanged={({ center, zoom }) => { 
          setCenter(center); 
          setZoom(zoom); 
        }}
        onClick={handleMapClick}
      >
        {/* Loop through all locations and create a marker for each */}
        {locations.map(location => {
          if (!location.position || location.position.length !== 2) return null;
          
          return (
            <Marker 
              key={location.id}
              width={40}
              anchor={location.position} 
              color={location.id.toString().startsWith('new-') ? '#22c55e' : '#db2777'} // Green for new pins, pink for existing
              onClick={() => alert(`Location: ${location.name}\nAvailable: ${location.items?.join(', ')}`)}
            />
          );
        })}

        {/* If we found the user's location, display the custom "You are here!" marker */}
        {userLocation && (
          <Overlay anchor={userLocation} offset={[0, 0]}>
             <UserLocationMarker />
          </Overlay>
        )}
      </Map>
    </div>
  );
}

