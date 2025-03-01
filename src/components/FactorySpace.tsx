
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface BuildingData {
  color: string;
  width: number;
  height: number;
  gradient: string;
  topColor: string;
  sideColor: string;
}

interface FactorySpaceProps {
  buildings: Record<string, BuildingData>;
  addCustomBuilding: (name: string, data: BuildingData) => void;
}

export function FactorySpace({ buildings, addCustomBuilding }: FactorySpaceProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [buildingName, setBuildingName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6E59A5");
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);

  const generateColors = (baseColor: string) => {
    // Lighten for top color
    const lightenColor = (color: string): string => {
      const hex = color.replace('#', '');
      let r = parseInt(hex.substr(0, 2), 16);
      let g = parseInt(hex.substr(2, 2), 16);
      let b = parseInt(hex.substr(4, 2), 16);
      
      r = Math.min(255, r + 40);
      g = Math.min(255, g + 40);
      b = Math.min(255, b + 40);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };
    
    // Darken for side color
    const darkenColor = (color: string): string => {
      const hex = color.replace('#', '');
      let r = parseInt(hex.substr(0, 2), 16);
      let g = parseInt(hex.substr(2, 2), 16);
      let b = parseInt(hex.substr(4, 2), 16);
      
      r = Math.max(0, r - 40);
      g = Math.max(0, g - 40);
      b = Math.max(0, b - 40);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };
    
    return {
      topColor: lightenColor(baseColor),
      sideColor: darkenColor(baseColor)
    };
  };

  const handleCreateBuilding = () => {
    if (!buildingName.trim()) return;
    
    // Check if name already exists
    if (buildings[buildingName]) {
      alert("A building with this name already exists!");
      return;
    }
    
    const { topColor, sideColor } = generateColors(primaryColor);
    
    const newBuilding: BuildingData = {
      color: primaryColor,
      width,
      height,
      gradient: `linear-gradient(135deg, ${primaryColor} 0%, ${sideColor} 100%)`,
      topColor,
      sideColor
    };
    
    addCustomBuilding(buildingName, newBuilding);
    resetForm();
  };

  const resetForm = () => {
    setIsCreating(false);
    setBuildingName("");
    setPrimaryColor("#6E59A5");
    setWidth(4);
    setHeight(4);
  };

  // Preview the building appearance
  const previewBuilding = () => {
    const { topColor, sideColor } = generateColors(primaryColor);
    const previewWidth = 100;
    const previewHeight = 100;
    const depth = Math.min(previewWidth, previewHeight) * 0.2;
    
    return (
      <div 
        className="relative mx-auto my-4"
        style={{
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
          transform: `perspective(500px) rotateX(20deg) rotateY(-20deg)`,
        }}
      >
        {/* Top face */}
        <div 
          className="absolute w-full h-full rounded-sm"
          style={{
            backgroundColor: topColor,
            backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${sideColor} 100%)`,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255,255,255,0.1)',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold text-shadow opacity-75">
            {buildingName || "New Building"}
          </div>
        </div>
        
        {/* Right side face */}
        <div
          className="absolute rounded-sm"
          style={{
            backgroundColor: sideColor,
            width: `${depth}px`,
            height: `${previewHeight}px`,
            top: `0px`,
            left: `${previewWidth}px`,
            transform: 'rotateY(90deg)',
            transformOrigin: 'left',
            opacity: 0.8,
          }}
        />
        
        {/* Bottom side face */}
        <div
          className="absolute rounded-sm"
          style={{
            backgroundColor: sideColor,
            width: `${previewWidth}px`,
            height: `${depth}px`,
            top: `${previewHeight}px`,
            left: `0px`,
            transform: 'rotateX(90deg)',
            transformOrigin: 'top',
            opacity: 0.8,
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-6">Factory Space</h2>
      
      {isCreating ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Create New Building</h3>
          
          {previewBuilding()}
          
          <div className="space-y-2">
            <Label htmlFor="building-name">Building Name</Label>
            <Input
              id="building-name"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              placeholder="Enter building name"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="building-color">Building Color</Label>
            <div className="flex space-x-2">
              <Input
                id="building-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Width: {width} units</Label>
            <Slider 
              value={[width]} 
              min={2} 
              max={8} 
              step={1} 
              onValueChange={(vals) => setWidth(vals[0])}
              className="py-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Height: {height} units</Label>
            <Slider 
              value={[height]} 
              min={2} 
              max={8} 
              step={1} 
              onValueChange={(vals) => setHeight(vals[0])}
              className="py-2"
            />
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleCreateBuilding} className="flex-1">Create</Button>
            <Button variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Button onClick={() => setIsCreating(true)} className="w-full">
            Create New Building
          </Button>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Existing Buildings</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {Object.entries(buildings).map(([name, data]) => (
                <div 
                  key={name} 
                  className="flex items-center space-x-2 p-2 rounded-md bg-gray-700/50 hover:bg-gray-700 transition-colors"
                >
                  <div 
                    className="w-8 h-8 rounded-sm flex-shrink-0"
                    style={{ 
                      background: data.gradient,
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <div className="flex-1 truncate">{name}</div>
                  <div className="text-xs text-gray-400">{data.width}×{data.height}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
