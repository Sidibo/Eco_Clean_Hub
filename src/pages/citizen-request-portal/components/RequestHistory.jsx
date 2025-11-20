import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequestHistory = ({ userRole = 'citizen' }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock request history data
  const requestHistory = [
  {
    id: "REQ-2024-001",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "completed",
    location: "123 Main Street, Apt 4B",
    fillLevel: "85%",
    urgency: "urgent",
    collectionTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    staffId: "STAFF-456",
    image: "https://images.unsplash.com/photo-1638519930507-d1d809d7c949",
    imageAlt: "Overflowing waste bin on residential street with scattered garbage around base"
  },
  {
    id: "REQ-2024-002",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: "in_progress",
    location: "456 Oak Avenue, Building C",
    fillLevel: "75%",
    urgency: "standard",
    estimatedCollection: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    staffId: "STAFF-789",
    image: "https://images.unsplash.com/photo-1706809669410-11d1f7c13331",
    imageAlt: "Three-quarter full municipal waste bin with mixed household garbage visible at top"
  },
  {
    id: "REQ-2024-003",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: "pending",
    location: "789 Pine Street, Unit 12",
    fillLevel: "60%",
    urgency: "standard",
    estimatedCollection: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
    image: "https://images.unsplash.com/photo-1733655688561-5381f5da1081",
    imageAlt: "Half-full residential waste bin with organized household waste and recycling materials"
  }];


  const filterOptions = [
  { value: 'all', label: 'All Requests', count: requestHistory?.length },
  { value: 'pending', label: 'Pending', count: requestHistory?.filter((r) => r?.status === 'pending')?.length },
  { value: 'in_progress', label: 'In Progress', count: requestHistory?.filter((r) => r?.status === 'in_progress')?.length },
  { value: 'completed', label: 'Completed', count: requestHistory?.filter((r) => r?.status === 'completed')?.length }];


  const filteredRequests = selectedFilter === 'all' ?
  requestHistory :
  requestHistory?.filter((request) => request?.status === selectedFilter);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          label: 'Completed'
        };
      case 'in_progress':
        return {
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          label: 'In Progress'
        };
      case 'pending':
        return {
          icon: 'Calendar',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          label: 'Pending'
        };
      default:
        return {
          icon: 'FileText',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-border',
          label: 'Unknown'
        };
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'overflow':return 'text-error';
      case 'urgent':return 'text-warning';
      default:return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatAddress = (address) => {
    const parts = address?.split(',');
    return parts?.length > 1 ? parts?.[0] : address;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground font-inter">
              Request History
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Track your waste collection requests and their status
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={16}>

            Export
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-2">
          {filterOptions?.map((filter) =>
          <button
            key={filter?.value}
            onClick={() => setSelectedFilter(filter?.value)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium civic-transition whitespace-nowrap ${
            selectedFilter === filter?.value ?
            'bg-primary text-primary-foreground' :
            'text-muted-foreground hover:text-foreground hover:bg-muted'}`
            }>

              <span>{filter?.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
            selectedFilter === filter?.value ?
            'bg-primary-foreground/20' :
            'bg-muted'}`
            }>
                {filter?.count}
              </span>
            </button>
          )}
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {filteredRequests?.length > 0 ?
          filteredRequests?.map((request) => {
            const statusConfig = getStatusConfig(request?.status);

            return (
              <div
                key={request?.id}
                className={`${statusConfig?.bgColor} ${statusConfig?.borderColor} border rounded-lg p-4 civic-transition hover:shadow-civic`}>

                  <div className="flex items-start space-x-4">
                    {/* Request Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                      src={request?.image}
                      alt={request?.imageAlt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }} />

                    </div>

                    {/* Request Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-semibold text-foreground font-inter">
                              {request?.id}
                            </h4>
                            <div className={`flex items-center space-x-1 ${statusConfig?.color}`}>
                              <Icon name={statusConfig?.icon} size={14} />
                              <span className="text-xs font-medium">{statusConfig?.label}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatAddress(request?.location)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(request?.timestamp)}
                          </p>
                          <p className={`text-xs font-medium ${getUrgencyColor(request?.urgency)}`}>
                            {request?.urgency?.charAt(0)?.toUpperCase() + request?.urgency?.slice(1)}
                          </p>
                        </div>
                      </div>

                      {/* Request Metrics */}
                      <div className="flex items-center space-x-4 mt-3 text-xs">
                        <div className="flex items-center space-x-1">
                          <Icon name="BarChart3" size={12} className="text-primary" />
                          <span className="text-muted-foreground">Fill:</span>
                          <span className="font-medium text-foreground">{request?.fillLevel}</span>
                        </div>
                        {request?.staffId &&
                      <div className="flex items-center space-x-1">
                            <Icon name="User" size={12} className="text-secondary" />
                            <span className="text-muted-foreground">Staff:</span>
                            <span className="font-medium text-foreground">{request?.staffId}</span>
                          </div>
                      }
                      </div>

                      {/* Status-specific Information */}
                      <div className="mt-3">
                        {request?.status === 'completed' &&
                      <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs">
                              <Icon name="Clock" size={12} className="text-success" />
                              <span className="text-muted-foreground">Collected:</span>
                              <span className="font-medium text-foreground">
                                {request?.collectionTime?.toLocaleString()}
                              </span>
                            </div>
                            <Button
                          variant="ghost"
                          size="sm"
                          iconName="ExternalLink"
                          iconPosition="left"
                          iconSize={12}
                          className="text-xs text-secondary hover:text-secondary/80">

                              Blockchain Proof
                            </Button>
                          </div>
                      }

                        {request?.status === 'in_progress' &&
                      <div className="flex items-center space-x-2 text-xs">
                            <Icon name="Truck" size={12} className="text-warning" />
                            <span className="text-muted-foreground">Est. Collection:</span>
                            <span className="font-medium text-foreground">
                              {request?.estimatedCollection?.toLocaleString()}
                            </span>
                          </div>
                      }

                        {request?.status === 'pending' &&
                      <div className="flex items-center space-x-2 text-xs">
                            <Icon name="Calendar" size={12} className="text-primary" />
                            <span className="text-muted-foreground">Scheduled for:</span>
                            <span className="font-medium text-foreground">
                              {request?.estimatedCollection?.toLocaleString()}
                            </span>
                          </div>
                      }
                      </div>

                      {/* Blockchain Hash for Completed Requests */}
                      {request?.status === 'completed' && request?.blockchainHash &&
                    <div className="mt-3 p-2 bg-secondary/10 rounded border border-secondary/20">
                          <div className="flex items-center space-x-2">
                            <Icon name="Shield" size={12} className="text-secondary" />
                            <span className="text-xs text-muted-foreground">Blockchain Hash:</span>
                            <code className="text-xs font-mono text-secondary">
                              {request?.blockchainHash?.slice(0, 10)}...{request?.blockchainHash?.slice(-8)}
                            </code>
                            <Button
                          variant="ghost"
                          size="icon"
                          iconName="Copy"
                          iconSize={12}
                          className="h-4 w-4"
                          onClick={() => navigator.clipboard?.writeText(request?.blockchainHash)} />

                          </div>
                        </div>
                    }
                    </div>
                  </div>
                </div>);

          }) :

          <div className="text-center py-8">
              <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No requests found for the selected filter
              </p>
            </div>
          }
        </div>

        {/* Load More */}
        {filteredRequests?.length > 0 &&
        <div className="text-center pt-4 border-t border-border">
            <Button
            variant="outline"
            iconName="ChevronDown"
            iconPosition="right"
            iconSize={16}>

              Load More Requests
            </Button>
          </div>
        }
      </div>
    </div>);

};

export default RequestHistory;