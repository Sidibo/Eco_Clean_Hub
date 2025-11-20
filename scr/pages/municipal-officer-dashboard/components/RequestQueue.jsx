import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RequestQueue = ({ onRequestSelect, selectedRequests, onBulkSelect }) => {
  const [sortBy, setSortBy] = useState('priority');
  const [filterBy, setFilterBy] = useState('all');
  const [requests, setRequests] = useState([]);

  // Mock request data
  useEffect(() => {
    const mockRequests = [
    {
      id: 'REQ-001',
      citizenName: 'Sarah Johnson',
      location: '123 Oak Street, Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'high',
      fillLevel: 95,
      binType: 'General Waste',
      estimatedTime: '15 mins',
      photo: "https://images.unsplash.com/photo-1734656323788-1c43b8db4eff",
      photoAlt: 'Overflowing green waste bin on city sidewalk with scattered garbage around base',
      aiAnalysis: 'Critical overflow detected - immediate attention required',
      status: 'pending',
      urgencyScore: 9.2
    },
    {
      id: 'REQ-002',
      citizenName: 'Michael Chen',
      location: '456 Pine Avenue, Midtown',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      priority: 'medium',
      fillLevel: 78,
      binType: 'Recycling',
      estimatedTime: '12 mins',
      photo: "https://images.unsplash.com/photo-1609957130658-6b6c13daabef",
      photoAlt: 'Blue recycling bin three-quarters full with plastic bottles and cardboard visible',
      aiAnalysis: 'Moderate fill level - schedule within 24 hours',
      status: 'pending',
      urgencyScore: 6.8
    },
    {
      id: 'REQ-003',
      citizenName: 'Emily Rodriguez',
      location: '789 Elm Drive, Uptown',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      priority: 'low',
      fillLevel: 45,
      binType: 'Organic Waste',
      estimatedTime: '8 mins',
      photo: "https://images.unsplash.com/photo-1726182065435-737192be06bf",
      photoAlt: 'Brown organic waste bin half-full with food scraps and garden waste visible',
      aiAnalysis: 'Normal fill level - routine collection schedule',
      status: 'assigned',
      urgencyScore: 3.5
    },
    {
      id: 'REQ-004',
      citizenName: 'David Thompson',
      location: '321 Maple Court, Eastside',
      coordinates: { lat: 40.7282, lng: -73.7949 },
      submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      priority: 'high',
      fillLevel: 88,
      binType: 'General Waste',
      estimatedTime: '18 mins',
      photo: "https://images.unsplash.com/photo-1708772042859-2ed69b9f24e2",
      photoAlt: 'Large gray waste bin nearly full with bags stacked high and lid slightly open',
      aiAnalysis: 'High capacity reached - priority collection needed',
      status: 'pending',
      urgencyScore: 8.1
    }];

    setRequests(mockRequests);
  }, []);

  const sortOptions = [
  { value: 'priority', label: 'Priority Level' },
  { value: 'time', label: 'Submission Time' },
  { value: 'location', label: 'Location' },
  { value: 'fillLevel', label: 'Fill Level' }];


  const filterOptions = [
  { value: 'all', label: 'All Requests' },
  { value: 'pending', label: 'Pending Only' },
  { value: 'high', label: 'High Priority' },
  { value: 'overflow', label: 'Overflow Risk' }];


  const getSortedAndFilteredRequests = () => {
    let filtered = [...requests];

    // Apply filters
    if (filterBy === 'pending') {
      filtered = filtered?.filter((req) => req?.status === 'pending');
    } else if (filterBy === 'high') {
      filtered = filtered?.filter((req) => req?.priority === 'high');
    } else if (filterBy === 'overflow') {
      filtered = filtered?.filter((req) => req?.fillLevel > 85);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return b?.urgencyScore - a?.urgencyScore;
        case 'time':
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        case 'fillLevel':
          return b?.fillLevel - a?.fillLevel;
        case 'location':
          return a?.location?.localeCompare(b?.location);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredRequests = getSortedAndFilteredRequests();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':return 'text-error bg-error/10';
      case 'medium':return 'text-warning bg-warning/10';
      case 'low':return 'text-success bg-success/10';
      default:return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':return 'text-warning bg-warning/10';
      case 'assigned':return 'text-primary bg-primary/10';
      case 'completed':return 'text-success bg-success/10';
      default:return 'text-muted-foreground bg-muted/10';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const handleRequestClick = (request) => {
    if (onRequestSelect) {
      onRequestSelect(request);
    }
  };

  const handleBulkSelection = (requestId) => {
    if (onBulkSelect) {
      onBulkSelect(requestId);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground font-inter">
            Collection Requests Queue
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {filteredRequests?.length} requests
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              iconSize={16}>

              Refresh
            </Button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            placeholder="Sort by..."
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            className="flex-1" />

          <Select
            placeholder="Filter by..."
            options={filterOptions}
            value={filterBy}
            onChange={setFilterBy}
            className="flex-1" />

          <Button
            variant="outline"
            size="default"
            iconName="Filter"
            iconPosition="left"
            iconSize={16}
            className="sm:w-auto">

            Advanced
          </Button>
        </div>
      </div>
      {/* Request List */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {filteredRequests?.map((request) =>
        <div
          key={request?.id}
          className={`p-4 hover:bg-muted/50 cursor-pointer civic-transition ${
          selectedRequests?.includes(request?.id) ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`
          }
          onClick={() => handleRequestClick(request)}>

            <div className="flex items-start space-x-4">
              {/* Selection Checkbox */}
              <div className="flex items-center pt-1">
                <input
                type="checkbox"
                checked={selectedRequests?.includes(request?.id) || false}
                onChange={(e) => {
                  e?.stopPropagation();
                  handleBulkSelection(request?.id);
                }}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2" />

              </div>

              {/* Request Photo */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                src={request?.photo}
                alt={request?.photoAlt}
                className="w-full h-full object-cover" />

              </div>

              {/* Request Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-foreground">
                        {request?.id}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(request?.priority)}`}>
                        {request?.priority?.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(request?.status)}`}>
                        {request?.status?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium">
                      {request?.citizenName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request?.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(request?.submittedAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Est. {request?.estimatedTime}
                    </p>
                  </div>
                </div>

                {/* Fill Level Indicator */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Fill Level</span>
                    <span className={`font-medium ${
                  request?.fillLevel > 85 ? 'text-error' :
                  request?.fillLevel > 70 ? 'text-warning' : 'text-success'}`
                  }>
                      {request?.fillLevel}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                    className={`h-2 rounded-full civic-transition ${
                    request?.fillLevel > 85 ? 'bg-error' :
                    request?.fillLevel > 70 ? 'bg-warning' : 'bg-success'}`
                    }
                    style={{ width: `${request?.fillLevel}%` }} />

                  </div>
                </div>

                {/* AI Analysis */}
                <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                  <div className="flex items-center space-x-1 mb-1">
                    <Icon name="Brain" size={12} className="text-accent" />
                    <span className="font-medium text-foreground">AI Analysis:</span>
                  </div>
                  <p className="text-muted-foreground">{request?.aiAnalysis}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 mt-3">
                  <Button
                  variant="outline"
                  size="sm"
                  iconName="MapPin"
                  iconPosition="left"
                  iconSize={14}
                  onClick={(e) => {
                    e?.stopPropagation();
                    // Handle view location
                  }}>

                    Location
                  </Button>
                  <Button
                  variant="outline"
                  size="sm"
                  iconName="Users"
                  iconPosition="left"
                  iconSize={14}
                  onClick={(e) => {
                    e?.stopPropagation();
                    // Handle assign staff
                  }}>

                    Assign
                  </Button>
                  <Button
                  variant="default"
                  size="sm"
                  iconName="CheckCircle"
                  iconPosition="left"
                  iconSize={14}
                  onClick={(e) => {
                    e?.stopPropagation();
                    // Handle approve
                  }}>

                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Bulk Actions Footer */}
      {selectedRequests?.length > 0 &&
      <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedRequests?.length} requests selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
              variant="outline"
              size="sm"
              iconName="Route"
              iconPosition="left"
              iconSize={14}>

                Plan Route
              </Button>
              <Button
              variant="outline"
              size="sm"
              iconName="Users"
              iconPosition="left"
              iconSize={14}>

                Bulk Assign
              </Button>
              <Button
              variant="default"
              size="sm"
              iconName="CheckCircle2"
              iconPosition="left"
              iconSize={14}>

                Approve All
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

};

export default RequestQueue;