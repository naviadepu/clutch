'use client';

// Make sure this path points to your map component file.
// We'll create PigeonMap.jsx in the next step.
import PigeonMap from '@/app/components/PigeonMap.jsx';

export default function MapPage() {
  return (
    // The `h-screen` class is CRUCIAL. It gives the map container a height
    // equal to the full screen height, making it visible.
    <div className="w-screen h-screen">
      <PigeonMap />
    </div>
  );
}