import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMap = ({ requests = [], onRequestSelect, selectedRequest }) => {
  const [mapView, setMapView] = useState('priority');
  const [showRoutes, setShowRoutes] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });

  // Mock map data
  const mapRequests = [
    {
      id: 'REQ-001',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      priority: 'high',
      fillLevel: 95,
      status: 'pending',
      address: '123 Oak Street'
    },
    {
      id: 'REQ-002',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      priority: 'medium',
      fillLevel: 78,
      status: 'pending',
      address: '456 Pine Avenue'
    },
    {
      id: 'REQ-003',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      priority: 'low',
      fillLevel: 45,
      status: 'assigned',
      address: '789 Elm Drive'
    },
    {
      id: 'REQ-004',
      coordinates: { lat: 40.7282, lng: -73.7949 },
      priority: 'high',
      fillLevel: 88,
      status: 'pending',
      address: '321 Maple Court'
    }
  ];

  const viewOptions = [
    { value: 'priority', label: 'Priority View', icon: 'AlertTriangle' },
    { value: 'fillLevel', label: 'Fill Level', icon: 'BarChart3' },
    { value: 'status', label: 'Status View', icon: 'CheckCircle' },
    { value: 'routes', label: 'Route Planning', icon: 'Route' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'assigned': return '#2563EB';
      case 'completed': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getFillLevelColor = (fillLevel) => {
    if (fillLevel > 85) return '#EF4444';
    if (fillLevel > 70) return '#F59E0B';
    return '#10B981';
  };

  const getMarkerColor = (request) => {
    switch (mapView) {
      case 'priority':
        return getPriorityColor(request?.priority);
      case 'status':
        return getStatusColor(request?.status);
      case 'fillLevel':
        return getFillLevelColor(request?.fillLevel);
      default:
        return '#2563EB';
    }
  };

  const handleMarkerClick = (request) => {
    if (onRequestSelect) {
      onRequestSelect(request);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground font-inter">
            Collection Map
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={showRoutes ? "default" : "outline"}
              size="sm"
              iconName="Route"
              iconPosition="left"
              iconSize={16}
              onClick={() => setShowRoutes(!showRoutes)}
            >
              Routes
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Maximize"
              iconSize={16}
            />
          </div>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap gap-2">
          {viewOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={mapView === option?.value ? "default" : "outline"}
              size="sm"
              iconName={option?.icon}
              iconPosition="left"
              iconSize={14}
              onClick={() => setMapView(option?.value)}
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-96 bg-muted/20">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Municipal Waste Collection Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=12&output=embed`}
          className="rounded-b-lg"
        />

        {/* Map Overlay with Request Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {mapRequests?.map((request, index) => (
            <div
              key={request?.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + index * 10}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleMarkerClick(request)}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center civic-transition hover:scale-110 ${
                  selectedRequest?.id === request?.id ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                style={{ backgroundColor: getMarkerColor(request) }}
              >
                <span className="text-xs text-white font-bold">
                  {request?.fillLevel}
                </span>
              </div>
              
              {/* Marker Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 civic-transition pointer-events-none">
                <div className="bg-popover border border-border rounded-lg shadow-lg p-2 text-xs whitespace-nowrap">
                  <p className="font-medium text-foreground">{request?.id}</p>
                  <p className="text-muted-foreground">{request?.address}</p>
                  <p className="text-muted-foreground">Fill: {request?.fillLevel}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Route Overlay */}
        {showRoutes && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#2563EB"
                  />
                </marker>
              </defs>
              <path
                d="M 20% 30% Q 35% 20% 50% 40% Q 65% 60% 80% 70%"
                stroke="#2563EB"
                strokeWidth="3"
                strokeDasharray="5,5"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            </svg>
          </div>
        )}
      </div>
      {/* Map Legend */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">Legend:</span>
            {mapView === 'priority' && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-xs text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">Low</span>
                </div>
              </div>
            )}
            {mapView === 'status' && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-xs text-muted-foreground">Pending</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">Assigned</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">Completed</span>
                </div>
              </div>
            )}
            {mapView === 'fillLevel' && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <span className="text-xs text-muted-foreground">&gt;85%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-xs text-muted-foreground">70-85%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">&lt;70%</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="MapPin" size={14} />
            <span>{mapRequests?.length} locations</span>
          </div>
        </div>

        {/* Route Information */}
        {showRoutes && (
          <div className="mt-3 p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Route" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Optimized Route</span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>Distance: 12.4 km</span>
                <span>Est. Time: 2h 15m</span>
                <span>Stops: 4</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;