
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MenuIcon, ArrowRightIcon, HelpCircleIcon, XIcon } from "lucide-react";
import { FactorySpace } from "@/components/FactorySpace";

// Building types
type BuildingType = "Barracks" | "SupplyDepot" | "CommandCenter" | string;

// Building data with colors and dimensions
interface BuildingData {
  color: string;
  width: number;
  height: number;
  gradient: string;
  topColor: string;
  sideColor: string;
}

// Dictionary of building data
const defaultBuildings: Record<BuildingType, BuildingData> = {
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
  const [buildings, setBuildings] = useState<Record<BuildingType, BuildingData>>(defaultBuildings);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [placedBuildings, setPlacedBuildings] = useState<PlacedBuilding[]>([]);
  const [isPlacing, setIsPlacing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFactoryOpen, setIsFactoryOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  
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

  // Add a new custom building
  const addCustomBuilding = (name: string, data: BuildingData) => {
    setBuildings(prev => ({
      ...prev,
      [name]: data
    }));
  };

  // Render a building block with 3D-like appearance
  const renderBuildingBlock = (building: PlacedBuilding | null, isPreview = false) => {
    if (!building && !selectedBuilding) return null;
    
    const type = building ? building.type : selectedBuilding as BuildingType;
    const buildingData = buildings[type];
    
    if (!buildingData) return null;
    
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
      <header className="p-4 border-b border-gray-700 bg-black/30 backdrop-blur-sm flex justify-between items-center">
        <h1 className="text-2xl font-medium tracking-tight">StarForge Builder</h1>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsFactoryOpen(!isFactoryOpen)}
          className="text-white"
          aria-label={isFactoryOpen ? "Close factory" : "Open factory"}
        >
          {isFactoryOpen ? <ArrowRightIcon size={20} /> : <MenuIcon size={20} />}
        </Button>
      </header>
      
      <main className="flex-1 flex">
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
        
        {/* Factory space panel */}
        {isFactoryOpen && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto animate-slide-in-right">
            <FactorySpace 
              buildings={buildings}
              addCustomBuilding={addCustomBuilding}
            />
          </div>
        )}
      </main>
      
      {/* Building selection panel */}
      <div className={`h-32 bg-gray-800 border-t border-gray-700 p-4 flex justify-center items-center space-x-6 ${isFactoryOpen ? 'pr-80' : ''} overflow-x-auto`}>
        {Object.entries(buildings).map(([type, data]) => (
          <Card 
            key={type}
            className="building-card w-24 h-24 flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105"
            style={{
              background: data.gradient,
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              opacity: 0.9,
            }}
            onClick={() => selectBuilding(type)}
          >
            <div className="text-white text-xs font-medium mt-2">
              {type}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Help button and help panel */}
      <div className="absolute top-4 right-20 flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowHelp(!showHelp)}
          className="text-white bg-black/50 backdrop-blur-sm rounded-full"
          aria-label="Toggle help"
        >
          <HelpCircleIcon size={20} />
        </Button>
      </div>
      
      {/* Instructions panel with close button */}
      {showHelp && (
        <div className="absolute top-16 right-4 max-w-xs bg-black/80 backdrop-blur-sm border border-gray-700 p-4 rounded-md shadow-lg animate-fade-in">
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-medium">Controls</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowHelp(false)}
              className="text-gray-400 hover:text-white -mt-1 -mr-1"
              aria-label="Close help"
            >
              <XIcon size={18} />
            </Button>
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Click a building from the bottom panel</li>
            <li>• Click on the grid to place it</li>
            <li>• Right-click to cancel placement</li>
            <li>• Use the factory to create custom buildings</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Index;
