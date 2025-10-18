'use client';

// This is a new, dedicated component for styling the user's location pin.
export default function UserLocationMarker() {
  return (
    // We use a container to position everything relative to the map anchor point.
    <div className="relative flex justify-center items-center pointer-events-none">
      
      {/* 1. The Pulsating Accuracy Circle */}
      <div className="absolute w-16 h-16 bg-pink-500/30 rounded-full animate-pulse"></div>

      {/* 2. The Custom SVG Pin Icon (Looks like your mockup) */}
      <svg width="40" height="40" viewBox="0 0 40 40" className="relative z-10 drop-shadow-lg">
        {/* Outer pin shape */}
        <path d="M20,40 C20,40 40,25 40,15 C40,6.7 31,0 20,0 C9,0 0,6.7 0,15 C0,25 20,40 20,40 Z" fill="#db2777" />
        {/* Inner white circle */}
        <circle cx="20" cy="15" r="10" fill="white" />
        {/* Center diamond */}
        <path d="M20,8 L25,15 L20,22 L15,15 Z" fill="#db2777" />
      </svg>
      
      {/* 3. The "You are here!" Text Bubble */}
      <div className="absolute bg-white px-3 py-1.5 rounded-lg shadow-xl text-sm font-semibold whitespace-nowrap -translate-y-12">
        You are here!
        {/* Little triangle pointing down */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
      </div>

    </div>
  );
}
