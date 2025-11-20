import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleAdaptiveNavbar from '../../components/ui/RoleAdaptiveNavbar';
import MapContainer from './components/MapContainer';
import LocationDetailsPanel from './components/LocationDetailsPanel';
import FilterControls from './components/FilterControls';
import LiveStatsPanel from './components/LiveStatsPanel';
import BlockchainVerificationBadge from './components/BlockchainVerificationBadge';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LiveCompletionTrackingMap = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('citizen'); // citizen, municipal, admin
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('full'); // full, split, mobile
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    binType: 'all',
    staff: 'all',
    priority: 'all',
    dateRange: { start: '', end: '' },
    search: ''
  });

  // Responsive design handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('mobile');
        setIsFilterCollapsed(true);
      } else if (window.innerWidth < 1024) {
        setViewMode('split');
      } else {
        setViewMode('full');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsPanelOpen(true);
  };

  // Handle panel close
  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedLocation(null), 300);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle status updates (for municipal users)
  const handleStatusUpdate = (locationId, newStatus) => {
    console.log(`Updating location ${locationId} to status: ${newStatus}`);
    // In a real app, this would update the backend and refresh the map
  };

  // Handle role switching (for demo purposes)
  const handleRoleSwitch = (role) => {
    setUserRole(role);
    setSelectedLocation(null);
    setIsPanelOpen(false);
  };

  // Navigation handlers
  const handleNavigateToSubmit = () => {
    navigate('/citizen-request-portal');
  };

  const handleNavigateToDashboard = () => {
    navigate('/municipal-officer-dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleAdaptiveNavbar userRole={userRole} />
        <div className="pt-16 h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-foreground font-inter">
                Loading Tracking Map
              </h2>
              <p className="text-muted-foreground">
                Initializing real-time waste collection monitoring...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <RoleAdaptiveNavbar userRole={userRole} />
      {/* Main Content */}
      <div className="pt-16 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" size={24} className="text-primary" />
                <div>
                  <h1 className="text-xl font-semibold text-foreground font-inter">
                    Live Completion Tracking
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Real-time waste collection monitoring with blockchain verification
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Role Switcher (Demo) */}
              <div className="hidden lg:flex items-center space-x-1 bg-muted rounded-lg p-1">
                {['citizen', 'municipal', 'admin']?.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={`px-3 py-1 text-xs rounded-md civic-transition capitalize ${
                      userRole === role
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                {userRole === 'citizen' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleNavigateToSubmit}
                    iconName="Camera"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Submit Request
                  </Button>
                )}
                {(userRole === 'municipal' || userRole === 'admin') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNavigateToDashboard}
                    iconName="BarChart3"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Dashboard
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters & Stats */}
          <div className={`${
            viewMode === 'mobile' ? 'hidden' : 
            viewMode === 'split' ? 'w-80' : 'w-96'
          } border-r border-border bg-background overflow-y-auto`}>
            <div className="p-4 space-y-4">
              {/* Live Stats */}
              <LiveStatsPanel userRole={userRole} />

              {/* Filter Controls */}
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                isCollapsed={isFilterCollapsed}
                onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
                totalLocations={40}
                filteredCount={32}
              />

              {/* Blockchain Status (for verified locations) */}
              {selectedLocation?.isBlockchainVerified && (
                <BlockchainVerificationBadge
                  transactionHash={selectedLocation?.blockchainHash}
                  timestamp={selectedLocation?.completedAt}
                  staffId={selectedLocation?.staffId}
                  isVerified={true}
                  onVerify={() => {}}
                />
              )}
            </div>
          </div>

          {/* Main Map Area */}
          <div className="flex-1 relative">
            <MapContainer
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              filters={filters}
              onFilterChange={handleFilterChange}
              viewMode={viewMode}
            />

            {/* Mobile Filter Toggle */}
            {viewMode === 'mobile' && (
              <div className="absolute top-4 left-4 z-40">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Filter"
                  iconPosition="left"
                  iconSize={16}
                  className="bg-background/90 backdrop-blur-sm"
                >
                  Filters
                </Button>
              </div>
            )}

            {/* Mobile Stats Toggle */}
            {viewMode === 'mobile' && (
              <div className="absolute bottom-20 left-4 right-4 z-40">
                <LiveStatsPanel userRole={userRole} className="bg-background/95 backdrop-blur-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Location Details Panel */}
        <LocationDetailsPanel
          location={selectedLocation}
          isOpen={isPanelOpen}
          onClose={handlePanelClose}
          onUpdateStatus={handleStatusUpdate}
          userRole={userRole}
        />

        {/* Mobile Bottom Navigation */}
        {viewMode === 'mobile' && (
          <div className="bg-card border-t border-border p-4 pb-20">
            <div className="flex items-center justify-around">
              <Button
                variant="ghost"
                size="sm"
                iconName="Filter"
                iconPosition="left"
                iconSize={16}
                className="flex-1 mx-1"
              >
                Filter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="BarChart3"
                iconPosition="left"
                iconSize={16}
                className="flex-1 mx-1"
              >
                Stats
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
                className="flex-1 mx-1"
              >
                Refresh
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCompletionTrackingMap;