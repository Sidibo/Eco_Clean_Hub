import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapContainer = ({
  selectedLocation,
  onLocationSelect,
  filters,
  onFilterChange,
  viewMode = 'full'
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [zoomLevel, setZoomLevel] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [showClusters, setShowClusters] = useState(true);
  const mapRef = useRef(null);

  // Mock collection locations with blockchain verification
  const collectionLocations = [
  {
    id: 1,
    lat: 40.7589,
    lng: -73.9851,
    status: 'completed',
    binType: 'general',
    address: '123 Main Street, Manhattan',
    requestId: 'REQ-2024-001',
    citizenPhoto: "https://images.unsplash.com/photo-1734656323788-1c43b8db4eff",
    citizenPhotoAlt: 'Overflowing green waste bin on city sidewalk with scattered garbage around base',
    aiAnalysis: 'Bin overflow detected - 95% confidence',
    assignedStaff: 'John Martinez',
    staffId: 'WM-001',
    completedAt: new Date('2024-11-18T09:30:00'),
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    isBlockchainVerified: true,
    estimatedTime: null,
    priority: 'high'
  },
  {
    id: 2,
    lat: 40.7505,
    lng: -73.9934,
    status: 'in_progress',
    binType: 'recycling',
    address: '456 Broadway, Manhattan',
    requestId: 'REQ-2024-002',
    citizenPhoto: "https://images.unsplash.com/photo-1598909195264-855410bb3ef8",
    citizenPhotoAlt: 'Blue recycling bin filled to capacity with plastic bottles and cardboard boxes',
    aiAnalysis: 'Bin 80% full - Collection recommended',
    assignedStaff: 'Sarah Chen',
    staffId: 'WM-002',
    completedAt: null,
    blockchainHash: null,
    isBlockchainVerified: false,
    estimatedTime: new Date(Date.now() + 45 * 60 * 1000),
    priority: 'medium'
  },
  {
    id: 3,
    lat: 40.7614,
    lng: -73.9776,
    status: 'pending',
    binType: 'organic',
    address: '789 Park Avenue, Manhattan',
    requestId: 'REQ-2024-003',
    citizenPhoto: "https://images.unsplash.com/photo-1577022849566-c34e63d9fbe8",
    citizenPhotoAlt: 'Brown organic waste bin with food scraps and garden waste visible at top',
    aiAnalysis: 'Bin 70% full - Schedule within 24 hours',
    assignedStaff: null,
    staffId: null,
    completedAt: null,
    blockchainHash: null,
    isBlockchainVerified: false,
    estimatedTime: null,
    priority: 'low'
  },
  {
    id: 4,
    lat: 40.7282,
    lng: -73.9942,
    status: 'blockchain_verified',
    binType: 'general',
    address: '321 Greenwich Street, Manhattan',
    requestId: 'REQ-2024-004',
    citizenPhoto: "https://images.unsplash.com/photo-1492116509925-046937c2b7e5",
    citizenPhotoAlt: 'Large black waste bin completely full with garbage bags stacked beside it',
    aiAnalysis: 'Critical overflow - Immediate attention required',
    assignedStaff: 'Mike Rodriguez',
    staffId: 'WM-003',
    completedAt: new Date('2024-11-18T08:15:00'),
    blockchainHash: '0x9876543210fedcba0987654321fedcba09876543',
    isBlockchainVerified: true,
    estimatedTime: null,
    priority: 'critical'
  }];


  // Filter locations based on current filters
  const getFilteredLocations = () => {
    return collectionLocations?.filter((location) => {
      if (filters?.status && filters?.status !== 'all' && location?.status !== filters?.status) {
        return false;
      }
      if (filters?.binType && filters?.binType !== 'all' && location?.binType !== filters?.binType) {
        return false;
      }
      if (filters?.staff && filters?.staff !== 'all' && location?.assignedStaff !== filters?.staff) {
        return false;
      }
      if (filters?.dateRange) {
        const locationDate = location?.completedAt || new Date();
        // Add date range filtering logic here
      }
      return true;
    });
  };

  const filteredLocations = getFilteredLocations();

  // Get marker color based on status
  const getMarkerColor = (status) => {
    switch (status) {
      case 'pending':return '#EF4444'; // red
      case 'in_progress':return '#F59E0B'; // yellow
      case 'completed':return '#10B981'; // green
      case 'blockchain_verified':return '#2563EB'; // blue
      default:return '#6B7280'; // gray
    }
  };

  // Handle location click
  const handleLocationClick = (location) => {
    onLocationSelect(location);
    setMapCenter({ lat: location?.lat, lng: location?.lng });
    setZoomLevel(15);
  };

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-refresh locations every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      console.log('Refreshing location data...');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 8));
  };

  const handleRecenter = () => {
    setMapCenter({ lat: 40.7128, lng: -74.0060 });
    setZoomLevel(12);
  };

  return (
    <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
      {/* Loading Overlay */}
      {isLoading &&
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Loading map data...</p>
          </div>
        </div>
      }
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full relative">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Waste Collection Tracking Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoomLevel}&output=embed`}
          className="border-0" />


        {/* Custom Overlay for Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredLocations?.map((location) => {
            // Calculate position based on map center (simplified positioning)
            const offsetX = (location?.lng - mapCenter?.lng) * 1000 + 50;
            const offsetY = (mapCenter?.lat - location?.lat) * 1000 + 50;

            return (
              <div
                key={location?.id}
                className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${50 + offsetX}%`,
                  top: `${50 + offsetY}%`
                }}
                onClick={() => handleLocationClick(location)}>

                {/* Status Marker */}
                <div className="relative">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: getMarkerColor(location?.status) }}>

                    {location?.isBlockchainVerified &&
                    <Icon name="Shield" size={12} color="white" />
                    }
                  </div>
                  
                  {/* Priority Indicator */}
                  {location?.priority === 'critical' &&
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-pulse" />
                  }
                  
                  {/* Selection Indicator */}
                  {selectedLocation?.id === location?.id &&
                  <div className="absolute inset-0 w-8 h-8 border-2 border-primary rounded-full animate-ping" />
                  }
                </div>
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-popover border border-border rounded-md px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                    <p className="font-medium">{location?.requestId}</p>
                    <p className="text-muted-foreground capitalize">{location?.status?.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>);

          })}
        </div>
      </div>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-background/90 backdrop-blur-sm">

          <Icon name="Plus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-background/90 backdrop-blur-sm">

          <Icon name="Minus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRecenter}
          className="bg-background/90 backdrop-blur-sm">

          <Icon name="RotateCcw" size={16} />
        </Button>
      </div>
      {/* Cluster Toggle */}
      <div className="absolute top-4 left-4 z-40">
        <Button
          variant={showClusters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowClusters(!showClusters)}
          iconName="Layers"
          iconPosition="left"
          iconSize={14}
          className="bg-background/90 backdrop-blur-sm">

          Clusters
        </Button>
      </div>
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 z-40">
        <h4 className="text-xs font-medium text-foreground mb-2">Status Legend</h4>
        <div className="space-y-1">
          {[
          { status: 'pending', label: 'Pending', color: '#EF4444' },
          { status: 'in_progress', label: 'In Progress', color: '#F59E0B' },
          { status: 'completed', label: 'Completed', color: '#10B981' },
          { status: 'blockchain_verified', label: 'Blockchain Verified', color: '#2563EB' }]?.
          map((item) =>
          <div key={item?.status} className="flex items-center space-x-2">
              <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item?.color }} />

              <span className="text-xs text-muted-foreground">{item?.label}</span>
            </div>
          )}
        </div>
      </div>
      {/* Real-time Update Indicator */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 z-40">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        <span className="text-xs text-muted-foreground">Live Updates</span>
      </div>
    </div>);

};

export default MapContainer;