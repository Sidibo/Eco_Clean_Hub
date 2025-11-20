import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ 
  userRole = 'citizen',
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const dropdownRef = useRef(null);

  // Sample notifications for demonstration
  const defaultNotifications = [
    {
      id: 1,
      type: 'collection_completed',
      title: 'Collection Completed',
      message: 'Your waste collection request has been completed successfully.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
      priority: 'normal',
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 2,
      type: 'blockchain_verification',
      title: 'Blockchain Verified',
      message: 'Your request has been verified on the blockchain.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      priority: 'normal',
      icon: 'Shield',
      color: 'text-accent'
    },
    {
      id: 3,
      type: 'system_update',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2-4 AM.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: true,
      priority: 'low',
      icon: 'Settings',
      color: 'text-warning'
    }
  ];

  const allNotifications = notifications?.length > 0 ? notifications : defaultNotifications;

  // Calculate unread count
  useEffect(() => {
    const unread = allNotifications?.filter(n => !n?.isRead)?.length;
    setUnreadCount(unread);
  }, [allNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter notifications based on user role and filter
  const getFilteredNotifications = () => {
    let filtered = allNotifications;

    // Role-based filtering
    if (userRole === 'citizen') {
      filtered = filtered?.filter(n => 
        ['collection_completed', 'collection_scheduled', 'blockchain_verification']?.includes(n?.type)
      );
    } else if (userRole === 'municipal') {
      filtered = filtered?.filter(n => 
        ['new_request', 'urgent_request', 'system_alert', 'staff_update']?.includes(n?.type) || 
        n?.type?.includes('collection')
      );
    }

    // Priority filtering
    if (filter === 'urgent') {
      filtered = filtered?.filter(n => n?.priority === 'high');
    } else if (filter === 'unread') {
      filtered = filtered?.filter(n => !n?.isRead);
    }

    return filtered?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const filteredNotifications = getFilteredNotifications();

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    if (!notification?.isRead && onMarkAsRead) {
      onMarkAsRead(notification?.id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      collection_completed: 'CheckCircle',
      collection_scheduled: 'Clock',
      blockchain_verification: 'Shield',
      new_request: 'FileText',
      urgent_request: 'AlertTriangle',
      system_alert: 'AlertCircle',
      system_update: 'Settings',
      staff_update: 'Users'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    
    const colorMap = {
      collection_completed: 'text-success',
      blockchain_verification: 'text-accent',
      system_alert: 'text-warning',
      urgent_request: 'text-error'
    };
    return colorMap?.[type] || 'text-primary';
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-civic-lg z-50 animate-civic-slide-in">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground font-inter">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  Mark all read
                </Button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 mt-3">
              {['all', 'unread', 'urgent']?.map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 text-xs rounded-md civic-transition ${
                    filter === filterType
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {filterType?.charAt(0)?.toUpperCase() + filterType?.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications?.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredNotifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-muted/50 cursor-pointer civic-transition ${
                      !notification?.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={getNotificationColor(notification?.type, notification?.priority)}>
                        <Icon 
                          name={getNotificationIcon(notification?.type)} 
                          size={16} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification?.isRead ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification?.title}
                          </p>
                          {!notification?.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification?.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification?.timestamp)}
                          </span>
                          {notification?.priority === 'high' && (
                            <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No notifications found
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications?.length > 0 && (
            <div className="p-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                iconName="ExternalLink"
                iconPosition="right"
                iconSize={14}
                className="text-xs text-primary hover:text-primary/80"
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
      {/* Mobile Notification Indicator */}
      <div className="md:hidden">
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-error rounded-full flex items-center justify-center">
            <span className="text-xs text-error-foreground font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;