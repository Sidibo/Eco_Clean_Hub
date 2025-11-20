import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveStatsPanel = ({ 
  userRole = 'citizen',
  refreshInterval = 30000,
  className = ''
}) => {
  const [stats, setStats] = useState({
    totalRequests: 40,
    pendingRequests: 8,
    inProgress: 5,
    completedToday: 12,
    blockchainVerified: 15,
    averageResponseTime: 45,
    activeStaff: 8,
    completionRate: 87
  });
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [trendData, setTrendData] = useState({
    requestsTrend: '+12%',
    completionTrend: '+8%',
    responseTrend: '-15%'
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      
      // Simulate data updates
      setTimeout(() => {
        setStats(prev => ({
          ...prev,
          totalRequests: prev?.totalRequests + Math.floor(Math.random() * 3),
          completedToday: prev?.completedToday + Math.floor(Math.random() * 2),
          blockchainVerified: prev?.blockchainVerified + Math.floor(Math.random() * 2)
        }));
        setLastUpdated(new Date());
        setIsRefreshing(false);
      }, 1000);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })?.format(timestamp);
  };

  const getStatsForRole = () => {
    if (userRole === 'citizen') {
      return [
        {
          label: 'My Active Requests',
          value: 3,
          icon: 'FileText',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          trend: null
        },
        {
          label: 'Completed This Week',
          value: 7,
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          trend: '+2'
        },
        {
          label: 'Avg Response Time',
          value: `${stats?.averageResponseTime}min`,
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          trend: trendData?.responseTrend
        },
        {
          label: 'Blockchain Verified',
          value: 5,
          icon: 'Shield',
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          trend: '+1'
        }
      ];
    } else {
      return [
        {
          label: 'Total Requests',
          value: stats?.totalRequests,
          icon: 'FileText',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          trend: trendData?.requestsTrend
        },
        {
          label: 'Pending',
          value: stats?.pendingRequests,
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          trend: null
        },
        {
          label: 'In Progress',
          value: stats?.inProgress,
          icon: 'Truck',
          color: 'text-secondary',
          bgColor: 'bg-secondary/10',
          trend: null
        },
        {
          label: 'Completed Today',
          value: stats?.completedToday,
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          trend: trendData?.completionTrend
        },
        {
          label: 'Blockchain Verified',
          value: stats?.blockchainVerified,
          icon: 'Shield',
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          trend: '+3'
        },
        {
          label: 'Active Staff',
          value: stats?.activeStaff,
          icon: 'Users',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
          trend: null
        }
      ];
    }
  };

  const statsData = getStatsForRole();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-civic ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground font-inter">
              Live Statistics
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-warning animate-pulse' : 'bg-success'}`} />
            <span className="text-xs text-muted-foreground">
              {isRefreshing ? 'Updating...' : 'Live'}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <Icon 
            name="RefreshCw" 
            size={16} 
            className={isRefreshing ? 'animate-spin' : ''} 
          />
        </Button>
      </div>
      {/* Stats Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsData?.map((stat, index) => (
            <div
              key={index}
              className={`${stat?.bgColor} rounded-lg p-4 civic-transition hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={stat?.color}>
                  <Icon name={stat?.icon} size={20} />
                </div>
                {stat?.trend && (
                  <span className={`text-xs font-medium ${
                    stat?.trend?.startsWith('+') ? 'text-success' : 'text-error'
                  }`}>
                    {stat?.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground font-inter">
                  {stat?.value}
                </p>
                <p className="text-xs text-muted-foreground font-inter">
                  {stat?.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Metrics for Municipal Users */}
        {(userRole === 'municipal' || userRole === 'admin') && (
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Performance Metrics</h4>
            <div className="space-y-3">
              {/* Completion Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium text-foreground">{stats?.completionRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full civic-transition"
                    style={{ width: `${stats?.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Response Time */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Avg Response Time</span>
                  <span className="font-medium text-foreground">{stats?.averageResponseTime} min</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full civic-transition"
                    style={{ width: `${Math.max(0, 100 - stats?.averageResponseTime)}%` }}
                  />
                </div>
              </div>

              {/* Blockchain Verification Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Blockchain Verification</span>
                  <span className="font-medium text-foreground">
                    {Math.round((stats?.blockchainVerified / stats?.totalRequests) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full civic-transition"
                    style={{ width: `${(stats?.blockchainVerified / stats?.totalRequests) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Last updated: {formatTime(lastUpdated)}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconPosition="left"
                iconSize={14}
                className="text-xs"
              >
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="BarChart3"
                iconPosition="left"
                iconSize={14}
                className="text-xs"
              >
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStatsPanel;