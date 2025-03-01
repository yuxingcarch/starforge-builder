
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Building types
type BuildingType = "Barracks" | "SupplyDepot" | "CommandCenter";

// Building data with colors and dimensions
const BUILDINGS = {
  Barracks: { color: "#f43f5e", width: 4, height: 4 },
  SupplyDepot: { color: "#10b981", width: 3, height: 3 },
  CommandCenter: { color: "#3b82f6", width: 6, height: 6 },
};

// Placed building interface
interface PlacedBuilding {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
}

const Index = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [placedBuildings, setPlacedBuildings] = useState<PlacedBuilding[]>([]);
  const [isPlacing, setIsPlacing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Handle building selection
  const selectBuilding = (building: BuildingType) => {
    setSelectedBuilding(building);
    setIsPlacing(true);
  };
  
  // Track mouse position
  useEffect(() => {
    if (!isPlacing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      
      const rect = gridRef.current.getBoundingClientRect();
      // Calculate position relative to the grid
      const x = Math.floor((e.clientX - rect.left) / 25) * 25;
      const y = Math.floor((e.clientY - rect.top) / 25) * 25;
      
      setMousePosition({ x, y });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isPlacing]);
  
  // Handle building placement
  const handleGridClick = () => {
    if (!isPlacing || !selectedBuilding) return;
    
    const newBuilding: PlacedBuilding = {
      id: `building-${Date.now()}`,
      type: selectedBuilding,
      x: mousePosition.x,
      y: mousePosition.y,
    };
    
    setPlacedBuildings([...placedBuildings, newBuilding]);
    setIsPlacing(false);
    setSelectedBuilding(null);
  };
  
  // Cancel placement on right click
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPlacing) {
      setIsPlacing(false);
      setSelectedBuilding(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="p-4 border-b border-gray-700 bg-black/30 backdrop-blur-sm">
        <h1 className="text-2xl font-medium tracking-tight">StarForge Builder</h1>
      </header>
      
      <main className="flex-1 flex flex-col">
        {/* Grid for placing buildings */}
        <div 
          ref={gridRef}
          className="relative flex-1 overflow-hidden bg-gray-900 bg-opacity-80"
          onClick={handleGridClick}
          onContextMenu={handleRightClick}
          style={{
            backgroundImage: 'linear-gradient(to right, #333333 1px, transparent 1px), linear-gradient(to bottom, #333333 1px, transparent 1px)',
            backgroundSize: '25px 25px',
          }}
        >
          {/* Render placed buildings */}
          {placedBuildings.map((building) => (
            <div
              key={building.id}
              className="absolute transition-all duration-300 animate-fade-in"
              style={{
                left: `${building.x}px`,
                top: `${building.y}px`,
                width: `${BUILDINGS[building.type].width * 25}px`,
                height: `${BUILDINGS[building.type].height * 25}px`,
                backgroundColor: BUILDINGS[building.type].color,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
              }}
            />
          ))}
          
          {/* Show building preview while placing */}
          {isPlacing && selectedBuilding && (
            <div
              className="absolute transition-all duration-150 opacity-70 pointer-events-none"
              style={{
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`,
                width: `${BUILDINGS[selectedBuilding].width * 25}px`,
                height: `${BUILDINGS[selectedBuilding].height * 25}px`,
                backgroundColor: BUILDINGS[selectedBuilding].color,
                boxShadow: '0 0 0 1px rgba(255,255,255,0.5)',
                borderRadius: '4px',
              }}
            />
          )}
        </div>
        
        {/* Building selection panel */}
        <div className="h-32 bg-gray-800 border-t border-gray-700 p-4 flex justify-center items-center space-x-6">
          {(Object.keys(BUILDINGS) as BuildingType[]).map((building) => (
            <Card 
              key={building}
              className={`w-24 h-24 flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105 ${
                selectedBuilding === building ? 'ring-2 ring-white' : ''
              }`}
              style={{
                backgroundColor: BUILDINGS[building].color,
                opacity: 0.9,
              }}
              onClick={() => selectBuilding(building)}
            >
              <div className="text-white text-xs font-medium mt-2">
                {building}
              </div>
            </Card>
          ))}
        </div>
      </main>
      
      {/* Instructions */}
      <div className="absolute top-4 right-4 max-w-xs bg-black/80 backdrop-blur-sm border border-gray-700 p-4 rounded-md shadow-lg">
        <h2 className="font-medium mb-2">Controls</h2>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Click a building from the bottom panel</li>
          <li>• Click on the grid to place it</li>
          <li>• Right-click to cancel placement</li>
        </ul>
      </div>
    </div>
  );
};

export default Index;
