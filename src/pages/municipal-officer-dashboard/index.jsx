import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import RoleAdaptiveNavbar from '../../components/ui/RoleAdaptiveNavbar';
import RequestStatusIndicator from '../../components/ui/RequestStatusIndicator';
import Web3ConnectionBadge from '../../components/ui/Web3ConnectionBadge';
import NotificationCenter from '../../components/ui/NotificationCenter';
import RequestQueue from './components/RequestQueue';
import MetricsPanel from './components/MetricsPanel';
import InteractiveMap from './components/InteractiveMap';
import StaffAssignment from './components/StaffAssignment';
import RequestDetails from './components/RequestDetails';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MunicipalOfficerDashboard = () => {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({});

  // Initialize dashboard data
  useEffect(() => {
    const stats = {
      totalRequests: 67,
      pendingRequests: 12,
      completedToday: 45,
      staffActive: 8,
      avgResponseTime: '2.3 hours',
      completionRate: 87
    };
    setDashboardStats(stats);
  }, []);

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
    setActiveTab('details');
  };

  const handleBulkSelect = (requestId) => {
    setSelectedRequests(prev => {
      if (prev?.includes(requestId)) {
        return prev?.filter(id => id !== requestId);
      } else {
        return [...prev, requestId];
      }
    });
  };

  const handleWeb3Connect = async () => {
    try {
      // Simulate Web3 connection
      setIsWeb3Connected(true);
    } catch (error) {
      console.error('Web3 connection failed:', error);
    }
  };

  const handleWeb3Disconnect = () => {
    setIsWeb3Connected(false);
  };

  const handleAssignmentComplete = (assignments) => {
    console.log('Assignments completed:', assignments);
    // Handle assignment completion logic
    setSelectedRequests([]);
  };

  const handleStatusUpdate = (requestId, newStatus) => {
    console.log('Status update:', requestId, newStatus);
    // Handle status update logic
  };

  const handlePriorityChange = (requestId, newPriority) => {
    console.log('Priority change:', requestId, newPriority);
    // Handle priority change logic
  };

  const tabOptions = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'queue', label: 'Request Queue', icon: 'List' },
    { id: 'map', label: 'Map View', icon: 'MapPin' },
    { id: 'staff', label: 'Staff Assignment', icon: 'Users' },
    { id: 'details', label: 'Request Details', icon: 'FileText' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Municipal Officer Dashboard - EcoClean Hub</title>
        <meta name="description" content="Municipal waste management operations dashboard for coordinating collection requests, staff assignments, and monitoring performance metrics." />
      </Helmet>
      {/* Navigation */}
      <RoleAdaptiveNavbar userRole="municipal" isAuthenticated={true} />
      {/* Main Content */}
      <div className="pt-16 pb-20 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Dashboard Header */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-inter">
                  Municipal Operations Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage waste collection requests and coordinate field operations
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-4">
                <RequestStatusIndicator
                  userRole="municipal"
                  requestCount={dashboardStats?.totalRequests}
                  completedCount={dashboardStats?.completedToday}
                  pendingCount={dashboardStats?.pendingRequests}
                  className="hidden lg:block"
                />
                <Web3ConnectionBadge
                  isConnected={isWeb3Connected}
                  onConnect={handleWeb3Connect}
                  onDisconnect={handleWeb3Disconnect}
                  walletAddress="0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
                  blockchainNetwork="Ethereum"
                  className="hidden lg:block"
                />
                <NotificationCenter
                  userRole="municipal"
                  className="lg:hidden"
                  onMarkAsRead={() => {}}
                  onMarkAllAsRead={() => {}}
                  onNotificationClick={() => {}}
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabOptions?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap civic-transition ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                    {tab?.id === 'queue' && selectedRequests?.length > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 ml-1">
                        {selectedRequests?.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Metrics Panel */}
                <div className="xl:col-span-2">
                  <MetricsPanel />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <RequestStatusIndicator
                    userRole="municipal"
                    requestCount={dashboardStats?.totalRequests}
                    completedCount={dashboardStats?.completedToday}
                    pendingCount={dashboardStats?.pendingRequests}
                  />
                  
                  <Web3ConnectionBadge
                    isConnected={isWeb3Connected}
                    onConnect={handleWeb3Connect}
                    onDisconnect={handleWeb3Disconnect}
                    walletAddress="0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
                    blockchainNetwork="Ethereum"
                  />

                  {/* Quick Actions */}
                  <div className="bg-card rounded-lg border border-border p-4">
                    <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        fullWidth
                        iconName="Plus"
                        iconPosition="left"
                        iconSize={16}
                        onClick={() => setActiveTab('queue')}
                      >
                        View All Requests
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        iconName="Users"
                        iconPosition="left"
                        iconSize={16}
                        onClick={() => setActiveTab('staff')}
                      >
                        Manage Staff
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        iconName="MapPin"
                        iconPosition="left"
                        iconSize={16}
                        onClick={() => setActiveTab('map')}
                      >
                        View Map
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'queue' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <RequestQueue
                    onRequestSelect={handleRequestSelect}
                    selectedRequests={selectedRequests}
                    onBulkSelect={handleBulkSelect}
                  />
                </div>
                <div>
                  {selectedRequests?.length > 0 && (
                    <StaffAssignment
                      selectedRequests={selectedRequests?.map(id => ({ id, location: `Location ${id}` }))}
                      onAssignmentComplete={handleAssignmentComplete}
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="xl:col-span-1">
                  <InteractiveMap
                    onRequestSelect={handleRequestSelect}
                    selectedRequest={selectedRequest}
                  />
                </div>
                <div className="xl:col-span-1">
                  <RequestDetails
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onStatusUpdate={handleStatusUpdate}
                    onPriorityChange={handlePriorityChange}
                  />
                </div>
              </div>
            )}

            {activeTab === 'staff' && (
              <StaffAssignment
                selectedRequests={selectedRequests?.map(id => ({ id, location: `Location ${id}` }))}
                onAssignmentComplete={handleAssignmentComplete}
              />
            )}

            {activeTab === 'details' && (
              <RequestDetails
                request={selectedRequest}
                onClose={() => {
                  setSelectedRequest(null);
                  setActiveTab('overview');
                }}
                onStatusUpdate={handleStatusUpdate}
                onPriorityChange={handlePriorityChange}
              />
            )}
          </div>

          {/* Mobile Bottom Actions */}
          <div className="md:hidden fixed bottom-16 left-4 right-4 z-30">
            <div className="bg-card border border-border rounded-lg p-3 shadow-civic-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Active: </span>
                  <span className="font-medium text-foreground">
                    {dashboardStats?.pendingRequests} requests
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="List"
                    iconSize={16}
                    onClick={() => setActiveTab('queue')}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="MapPin"
                    iconSize={16}
                    onClick={() => setActiveTab('map')}
                  />
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Users"
                    iconSize={16}
                    onClick={() => setActiveTab('staff')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunicipalOfficerDashboard;