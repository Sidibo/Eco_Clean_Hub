import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Web3ConnectionBadge = ({ 
  isConnected = false, 
  onConnect, 
  onDisconnect,
  walletAddress = '',
  blockchainNetwork = 'Ethereum',
  className = '' 
}) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isConnecting, setIsConnecting] = useState(false);
  const [verificationCount, setVerificationCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Connection status states: 'disconnected', 'connecting', 'connected', 'error'
  useEffect(() => {
    if (isConnected) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('disconnected');
    }
  }, [isConnected]);

  // Simulate blockchain verifications
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setVerificationCount(prev => prev + 1);
      }, 45000); // New verification every 45 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const handleConnect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onConnect) {
        await onConnect();
      }
      
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('error');
      setTimeout(() => setConnectionStatus('disconnected'), 3000);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect();
    }
    setConnectionStatus('disconnected');
    setVerificationCount(0);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connecting':
        return {
          icon: 'Loader2',
          iconClass: 'animate-spin text-warning',
          bgClass: 'bg-warning/10 border-warning/20',
          text: 'Connecting...',
          subtext: 'Initializing wallet connection',
          actionButton: null
        };
      case 'connected':
        return {
          icon: 'Shield',
          iconClass: 'text-success',
          bgClass: 'bg-success/10 border-success/20',
          text: 'Blockchain Verified',
          subtext: `${verificationCount} verifications`,
          actionButton: 'disconnect'
        };
      case 'error':
        return {
          icon: 'ShieldAlert',
          iconClass: 'text-error',
          bgClass: 'bg-error/10 border-error/20',
          text: 'Connection Failed',
          subtext: 'Please try again',
          actionButton: 'retry'
        };
      default:
        return {
          icon: 'ShieldOff',
          iconClass: 'text-muted-foreground',
          bgClass: 'bg-muted/50 border-border',
          text: 'Connect Wallet',
          subtext: 'Enable blockchain features',
          actionButton: 'connect'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`relative ${className}`}>
      {/* Main Badge */}
      <div 
        className={`${statusConfig?.bgClass} rounded-lg border p-3 civic-transition cursor-pointer`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center space-x-3">
          <div className={statusConfig?.iconClass}>
            <Icon name={statusConfig?.icon} size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground font-inter">
              {statusConfig?.text}
            </p>
            <p className="text-xs text-muted-foreground font-inter">
              {statusConfig?.subtext}
            </p>
          </div>
          {isConnected && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <Icon 
                name={showDetails ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-muted-foreground" 
              />
            </div>
          )}
        </div>
      </div>
      {/* Expanded Details */}
      {showDetails && isConnected && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-civic-lg z-50 p-4 animate-civic-slide-in">
          <div className="space-y-3">
            {/* Wallet Info */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Wallet Address</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {formatAddress(walletAddress)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Copy"
                  iconSize={12}
                  className="h-6 w-6"
                  onClick={() => navigator.clipboard?.writeText(walletAddress)}
                />
              </div>
            </div>

            {/* Network Info */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Network</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-xs font-medium text-foreground">{blockchainNetwork}</span>
              </div>
            </div>

            {/* Verification Stats */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Verifications</span>
              <span className="text-xs font-medium text-foreground">{verificationCount} completed</span>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                iconName="ExternalLink"
                iconPosition="left"
                iconSize={12}
                className="text-xs"
              >
                View on Explorer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                iconName="LogOut"
                iconPosition="left"
                iconSize={12}
                className="text-xs text-error hover:text-error/80"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Action Button for Non-Connected States */}
      {!isConnected && statusConfig?.actionButton && (
        <div className="mt-2">
          <Button
            variant={statusConfig?.actionButton === 'connect' ? 'default' : 'outline'}
            size="sm"
            onClick={handleConnect}
            disabled={isConnecting}
            loading={isConnecting}
            iconName={statusConfig?.actionButton === 'connect' ? 'Wallet' : 'RefreshCw'}
            iconPosition="left"
            iconSize={16}
            fullWidth
          >
            {statusConfig?.actionButton === 'connect' ? 'Connect Wallet' : 'Retry Connection'}
          </Button>
        </div>
      )}
      {/* Compact Mobile View */}
      <div className="md:hidden">
        {isConnected && (
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-1 text-xs text-success">
              <Icon name="Shield" size={12} />
              <span>Verified</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {verificationCount} confirmations
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Web3ConnectionBadge;