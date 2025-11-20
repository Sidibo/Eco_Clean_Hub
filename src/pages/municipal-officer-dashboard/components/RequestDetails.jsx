import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RequestDetails = ({ request, onClose, onStatusUpdate, onPriorityChange }) => {
  const [newStatus, setNewStatus] = useState(request?.status || 'pending');
  const [newPriority, setNewPriority] = useState(request?.priority || 'medium');
  const [notes, setNotes] = useState('');

  if (!request) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Request Selected</h3>
        <p className="text-muted-foreground">
          Select a request from the queue to view details and take actions.
        </p>
      </div>
    );
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'assigned', label: 'Assigned to Staff' },
    { value: 'in_progress', label: 'Collection in Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-error bg-error/10 border-error/20';
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10 border-success/20';
      case 'in_progress': return 'text-primary bg-primary/10 border-primary/20';
      case 'assigned': return 'text-primary bg-primary/10 border-primary/20';
      case 'approved': return 'text-success bg-success/10 border-success/20';
      case 'pending': return 'text-warning bg-warning/10 border-warning/20';
      case 'rejected': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    return `${minutes}m ago`;
  };

  const handleSaveChanges = () => {
    if (onStatusUpdate && newStatus !== request?.status) {
      onStatusUpdate(request?.id, newStatus);
    }
    if (onPriorityChange && newPriority !== request?.priority) {
      onPriorityChange(request?.id, newPriority);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-foreground font-inter">
              Request Details
            </h2>
            <span className="text-sm text-muted-foreground">
              {request?.id}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>
      </div>
      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Request Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo and AI Analysis */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Submitted Photo</h3>
              <div className="w-full h-48 rounded-lg overflow-hidden border border-border">
                <Image
                  src={request?.photo}
                  alt={request?.photoAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Brain" size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">AI Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground">{request?.aiAnalysis}</p>
              <div className="mt-2 flex items-center space-x-4 text-xs">
                <span className="text-muted-foreground">
                  Confidence: <span className="font-medium text-foreground">94.2%</span>
                </span>
                <span className="text-muted-foreground">
                  Urgency Score: <span className="font-medium text-foreground">{request?.urgencyScore}/10</span>
                </span>
              </div>
            </div>
          </div>

          {/* Request Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Request Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Citizen:</span>
                  <span className="text-sm font-medium text-foreground">{request?.citizenName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="text-sm font-medium text-foreground">{request?.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Submitted:</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatTimeAgo(request?.submittedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bin Type:</span>
                  <span className="text-sm font-medium text-foreground">{request?.binType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Est. Time:</span>
                  <span className="text-sm font-medium text-foreground">{request?.estimatedTime}</span>
                </div>
              </div>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${getPriorityColor(request?.priority)}`}>
                <div className="text-center">
                  <Icon name="AlertTriangle" size={20} className="mx-auto mb-1" />
                  <p className="text-xs font-medium">Priority</p>
                  <p className="text-sm font-semibold capitalize">{request?.priority}</p>
                </div>
              </div>
              <div className={`p-3 rounded-lg border ${getStatusColor(request?.status)}`}>
                <div className="text-center">
                  <Icon name="CheckCircle" size={20} className="mx-auto mb-1" />
                  <p className="text-xs font-medium">Status</p>
                  <p className="text-sm font-semibold capitalize">{request?.status}</p>
                </div>
              </div>
            </div>

            {/* Fill Level Indicator */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Fill Level</span>
                <span className={`font-medium ${
                  request?.fillLevel > 85 ? 'text-error' : 
                  request?.fillLevel > 70 ? 'text-warning' : 'text-success'
                }`}>
                  {request?.fillLevel}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`h-3 rounded-full civic-transition ${
                    request?.fillLevel > 85 ? 'bg-error' : 
                    request?.fillLevel > 70 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${request?.fillLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Map */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Location</h3>
          <div className="w-full h-32 rounded-lg overflow-hidden border border-border">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={`Request location at ${request?.location}`}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${request?.coordinates?.lat},${request?.coordinates?.lng}&z=16&output=embed`}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Update Status"
              options={statusOptions}
              value={newStatus}
              onChange={setNewStatus}
            />
            <Select
              label="Change Priority"
              options={priorityOptions}
              value={newPriority}
              onChange={setNewPriority}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Officer Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e?.target?.value)}
              placeholder="Add notes about this request..."
              className="w-full h-20 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              iconSize={16}
              onClick={handleSaveChanges}
              disabled={newStatus === request?.status && newPriority === request?.priority}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              iconName="Users"
              iconPosition="left"
              iconSize={16}
            >
              Assign Staff
            </Button>
            <Button
              variant="outline"
              iconName="MapPin"
              iconPosition="left"
              iconSize={16}
            >
              View on Map
            </Button>
          </div>
        </div>

        {/* Blockchain Verification */}
        <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Blockchain Verification</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            This request will be logged on the blockchain upon completion for transparency.
          </p>
          <div className="flex items-center space-x-4 text-xs">
            <span className="text-muted-foreground">
              Transaction Hash: <code className="text-foreground">0x7a8b9c...</code>
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconName="ExternalLink"
              iconPosition="right"
              iconSize={12}
              className="text-xs"
            >
              View on Explorer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;