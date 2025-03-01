
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Building types
type BuildingType = "Barracks" | "SupplyDepot" | "CommandCenter";

// Building data with colors and dimensions
const BUILDINGS = {
  Barracks: { 
    color: "#f43f5e", 
    width: 4, 
    height: 4,
    gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    topColor: "#fb7185",
    sideColor: "#e11d48"
  },
  SupplyDepot: { 
    color: "#10b981", 
    width: 3, 
    height: 3,
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    topColor: "#34d399",
    sideColor: "#059669"
  },
  CommandCenter: { 
    color: "#3b82f6", 
    width: 6, 
    height: 6,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    topColor: "#60a5fa",
    sideColor: "#2563eb"
  },
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

  // Render a building block with 3D-like appearance
  const renderBuildingBlock = (building: PlacedBuilding | null, isPreview = false) => {
    if (!building && !selectedBuilding) return null;
    
    const type = building ? building.type : selectedBuilding as BuildingType;
    const buildingData = BUILDINGS[type];
    const x = building ? building.x : mousePosition.x;
    const y = building ? building.y : mousePosition.y;
    
    const width = buildingData.width * 25;
    const height = buildingData.height * 25;
    const depth = Math.min(width, height) * 0.2; // Depth effect
    
    return (
      <div
        className={`absolute transition-all duration-150 ${isPreview ? 'opacity-70 pointer-events-none' : 'animate-fade-in'}`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
          transform: `perspective(500px) translateZ(0px)`,
        }}
      >
        {/* Top face */}
        <div 
          className="absolute w-full h-full rounded-sm"
          style={{
            backgroundColor: buildingData.topColor,
            backgroundImage: buildingData.gradient,
            boxShadow: isPreview ? 'none' : '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255,255,255,0.1)',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          {/* Building name on top (only for placed buildings) */}
          {!isPreview && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold text-shadow opacity-75">
              {type}
            </div>
          )}
        </div>
        
        {/* Right side face - creates 3D effect */}
        <div
          className="absolute rounded-sm"
          style={{
            backgroundColor: buildingData.sideColor,
            width: `${depth}px`,
            height: `${height}px`,
            top: `0px`,
            left: `${width}px`,
            transform: 'rotateY(90deg)',
            transformOrigin: 'left',
            opacity: isPreview ? 0.5 : 0.8,
          }}
        />
        
        {/* Bottom side face - creates 3D effect */}
        <div
          className="absolute rounded-sm"
          style={{
            backgroundColor: buildingData.sideColor,
            width: `${width}px`,
            height: `${depth}px`,
            top: `${height}px`,
            left: `0px`,
            transform: 'rotateX(90deg)',
            transformOrigin: 'top',
            opacity: isPreview ? 0.5 : 0.8,
          }}
        />
      </div>
    );
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
          {placedBuildings.map((building) => renderBuildingBlock(building))}
          
          {/* Show building preview while placing */}
          {isPlacing && selectedBuilding && renderBuildingBlock(null, true)}
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
                background: BUILDINGS[building].gradient,
                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
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
