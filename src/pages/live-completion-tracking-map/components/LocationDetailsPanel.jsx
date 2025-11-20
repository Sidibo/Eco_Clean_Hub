import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const LocationDetailsPanel = ({ 
  location, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  userRole = 'citizen'
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);

  if (!location) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-error';
      case 'in_progress': return 'text-warning';
      case 'completed': return 'text-success';
      case 'blockchain_verified': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'in_progress': return 'Truck';
      case 'completed': return 'CheckCircle';
      case 'blockchain_verified': return 'Shield';
      default: return 'Circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Not available';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(timestamp));
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      if (onUpdateStatus) {
        onUpdateStatus(location?.id, newStatus);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-background border-l border-border shadow-civic-lg transform transition-transform duration-300 z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`${getStatusColor(location?.status)}`}>
              <Icon name={getStatusIcon(location?.status)} size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground font-inter">
                {location?.requestId}
              </h3>
              <p className="text-xs text-muted-foreground capitalize">
                {location?.status?.replace('_', ' ')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Priority Badge */}
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(location?.priority)}`}>
              {location?.priority?.toUpperCase()} PRIORITY
            </span>
            {location?.isBlockchainVerified && (
              <div className="flex items-center space-x-1 text-accent">
                <Icon name="Shield" size={14} />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
          </div>

          {/* Location Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Location Details</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">{location?.address}</p>
                  <p className="text-xs text-muted-foreground">
                    {location?.lat?.toFixed(6)}, {location?.lng?.toFixed(6)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Trash2" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground capitalize">{location?.binType} Waste</span>
              </div>
            </div>
          </div>

          {/* Citizen Photo & AI Analysis */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Original Request</h4>
            <div className="bg-muted rounded-lg p-3 space-y-3">
              <div className="aspect-video rounded-md overflow-hidden">
                <Image
                  src={location?.citizenPhoto}
                  alt={location?.citizenPhotoAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Brain" size={14} className="text-accent" />
                  <span className="text-xs font-medium text-foreground">AI Analysis</span>
                </div>
                <p className="text-xs text-muted-foreground">{location?.aiAnalysis}</p>
              </div>
            </div>
          </div>

          {/* Staff Assignment */}
          {location?.assignedStaff && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Assigned Staff</h4>
              <div className="flex items-center space-x-3 bg-muted rounded-lg p-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{location?.assignedStaff}</p>
                  <p className="text-xs text-muted-foreground">ID: {location?.staffId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Timeline</h4>
            <div className="space-y-2">
              {location?.completedAt && (
                <div className="flex items-center space-x-2 text-xs">
                  <Icon name="CheckCircle" size={12} className="text-success" />
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="text-foreground">{formatTimestamp(location?.completedAt)}</span>
                </div>
              )}
              {location?.estimatedTime && (
                <div className="flex items-center space-x-2 text-xs">
                  <Icon name="Clock" size={12} className="text-warning" />
                  <span className="text-muted-foreground">ETA:</span>
                  <span className="text-foreground">{formatTimestamp(location?.estimatedTime)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Blockchain Verification */}
          {location?.isBlockchainVerified && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">Blockchain Record</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBlockchainDetails(!showBlockchainDetails)}
                  iconName={showBlockchainDetails ? "ChevronUp" : "ChevronDown"}
                  iconPosition="right"
                  iconSize={14}
                  className="text-xs"
                >
                  Details
                </Button>
              </div>
              
              {showBlockchainDetails && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="Shield" size={14} className="text-accent" />
                    <span className="text-xs font-medium text-foreground">Ethereum Verified</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Transaction Hash:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(location?.blockchainHash)}
                        iconName="Copy"
                        iconSize={10}
                        className="h-5 px-1"
                      />
                    </div>
                    <code className="text-xs font-mono bg-background px-2 py-1 rounded block break-all">
                      {location?.blockchainHash}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ExternalLink"
                    iconPosition="right"
                    iconSize={12}
                    className="text-xs w-full"
                  >
                    View on Etherscan
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Municipal Actions */}
          {(userRole === 'municipal' || userRole === 'admin') && location?.status !== 'blockchain_verified' && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Actions</h4>
              <div className="space-y-2">
                {location?.status === 'pending' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleStatusUpdate('in_progress')}
                    loading={isUpdating}
                    iconName="Play"
                    iconPosition="left"
                    iconSize={14}
                    fullWidth
                  >
                    Start Collection
                  </Button>
                )}
                {location?.status === 'in_progress' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusUpdate('completed')}
                    loading={isUpdating}
                    iconName="CheckCircle"
                    iconPosition="left"
                    iconSize={14}
                    fullWidth
                  >
                    Mark Complete
                  </Button>
                )}
                {location?.status === 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('blockchain_verified')}
                    loading={isUpdating}
                    iconName="Shield"
                    iconPosition="left"
                    iconSize={14}
                    fullWidth
                  >
                    Blockchain Verify
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated: {formatTimestamp(new Date())}</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailsPanel;