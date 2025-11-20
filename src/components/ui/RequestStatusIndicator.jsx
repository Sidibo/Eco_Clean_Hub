import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const RequestStatusIndicator = ({ 
  userRole = 'citizen', 
  requestCount = 0, 
  completedCount = 0, 
  pendingCount = 0,
  className = '' 
}) => {
  const [currentStatus, setCurrentStatus] = useState('idle');
  const [isProcessing, setIsProcessing] = useState(false);

  // Status configurations based on user role
  const getStatusConfig = () => {
    if (userRole === 'citizen') {
      return {
        title: 'My Requests',
        metrics: [
          {
            label: 'Active',
            value: pendingCount,
            icon: 'Clock',
            color: 'text-warning',
            bgColor: 'bg-warning/10'
          },
          {
            label: 'Completed',
            value: completedCount,
            icon: 'CheckCircle',
            color: 'text-success',
            bgColor: 'bg-success/10'
          }
        ]
      };
    } else {
      return {
        title: 'Operations Overview',
        metrics: [
          {
            label: 'Total Requests',
            value: requestCount,
            icon: 'FileText',
            color: 'text-primary',
            bgColor: 'bg-primary/10'
          },
          {
            label: 'Pending',
            value: pendingCount,
            icon: 'Clock',
            color: 'text-warning',
            bgColor: 'bg-warning/10'
          },
          {
            label: 'Completed',
            value: completedCount,
            icon: 'CheckCircle2',
            color: 'text-success',
            bgColor: 'bg-success/10'
          }
        ]
      };
    }
  };

  const statusConfig = getStatusConfig();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingCount > 0) {
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 2000);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [pendingCount]);

  // Calculate completion rate
  const completionRate = requestCount > 0 ? Math.round((completedCount / requestCount) * 100) : 0;

  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground font-inter">
          {statusConfig?.title}
        </h3>
        {isProcessing && (
          <div className="flex items-center space-x-1 text-xs text-warning">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
            <span>Processing</span>
          </div>
        )}
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {statusConfig?.metrics?.map((metric, index) => (
          <div
            key={index}
            className={`${metric?.bgColor} rounded-md p-3 civic-transition hover:scale-105`}
          >
            <div className="flex items-center space-x-2">
              <div className={`${metric?.color}`}>
                <Icon name={metric?.icon} size={16} />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground font-inter">
                  {metric?.value}
                </p>
                <p className="text-xs text-muted-foreground font-inter">
                  {metric?.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Progress Bar (for municipal users) */}
      {userRole !== 'citizen' && requestCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-medium text-foreground">{completionRate}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full civic-transition"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
      {/* Status Messages */}
      <div className="mt-4 space-y-2">
        {userRole === 'citizen' && (
          <div className="text-xs text-muted-foreground">
            {pendingCount > 0 ? (
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} className="text-warning" />
                <span>Your requests are being processed</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Icon name="CheckCircle" size={12} className="text-success" />
                <span>All requests completed</span>
              </div>
            )}
          </div>
        )}

        {(userRole === 'municipal' || userRole === 'admin') && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Activity" size={12} />
              <span>System Status: Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-success font-medium">Online</span>
            </div>
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="mt-4 pt-3 border-t border-border">
        {userRole === 'citizen' ? (
          <div className="flex items-center justify-between">
            <button className="text-xs text-primary hover:text-primary/80 civic-transition font-medium">
              View All Requests
            </button>
            <button className="text-xs text-secondary hover:text-secondary/80 civic-transition font-medium">
              Submit New Request
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button className="text-xs text-primary hover:text-primary/80 civic-transition font-medium">
              View Dashboard
            </button>
            <button className="text-xs text-accent hover:text-accent/80 civic-transition font-medium">
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestStatusIndicator;