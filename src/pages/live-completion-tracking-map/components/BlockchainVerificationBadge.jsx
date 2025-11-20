import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BlockchainVerificationBadge = ({ 
  transactionHash,
  timestamp,
  staffId,
  isVerified = false,
  isVerifying = false,
  onVerify,
  className = ''
}) => {
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [confirmations, setConfirmations] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Simulate blockchain confirmations
  useEffect(() => {
    if (isVerified && transactionHash) {
      setVerificationStatus('verified');
      setConfirmations(12); // Simulate confirmed blocks
    } else if (isVerifying) {
      setVerificationStatus('verifying');
      const interval = setInterval(() => {
        setConfirmations(prev => {
          if (prev >= 12) {
            setVerificationStatus('verified');
            clearInterval(interval);
            return 12;
          }
          return prev + 1;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isVerified, isVerifying, transactionHash]);

  const getStatusConfig = () => {
    switch (verificationStatus) {
      case 'verified':
        return {
          icon: 'Shield',
          iconClass: 'text-accent',
          bgClass: 'bg-accent/10 border-accent/20',
          text: 'Blockchain Verified',
          subtext: `${confirmations}/12 confirmations`,
          showHash: true
        };
      case 'verifying':
        return {
          icon: 'Loader2',
          iconClass: 'text-warning animate-spin',
          bgClass: 'bg-warning/10 border-warning/20',
          text: 'Verifying on Blockchain',
          subtext: `${confirmations}/12 confirmations`,
          showHash: false
        };
      default:
        return {
          icon: 'ShieldOff',
          iconClass: 'text-muted-foreground',
          bgClass: 'bg-muted/50 border-border',
          text: 'Not Verified',
          subtext: 'Awaiting blockchain verification',
          showHash: false
        };
    }
  };

  const statusConfig = getStatusConfig();

  const formatHash = (hash) => {
    if (!hash) return '';
    return `${hash?.slice(0, 8)}...${hash?.slice(-6)}`;
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(ts));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  const handleVerifyClick = () => {
    if (onVerify) {
      onVerify();
    }
  };

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
          {verificationStatus === 'verified' && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-accent rounded-full" />
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
      {showDetails && verificationStatus === 'verified' && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-civic-lg z-50 p-4 animate-civic-slide-in">
          <div className="space-y-4">
            {/* Verification Header */}
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">Ethereum Verification</span>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Transaction Hash</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transactionHash)}
                    iconName="Copy"
                    iconSize={12}
                    className="h-6 px-2"
                  />
                </div>
                <div className="bg-muted rounded-md p-2">
                  <code className="text-xs font-mono text-foreground break-all">
                    {transactionHash}
                  </code>
                </div>
              </div>

              {/* Verification Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Verified At</span>
                  <p className="font-medium text-foreground">{formatTimestamp(timestamp)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Staff ID</span>
                  <p className="font-medium text-foreground">{staffId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Network</span>
                  <p className="font-medium text-foreground">Ethereum Mainnet</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Confirmations</span>
                  <p className="font-medium text-foreground">{confirmations}/12</p>
                </div>
              </div>

              {/* Gas Fee Info */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Gas Fee</span>
                  <span className="font-medium text-foreground">0.0023 ETH</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Block Number</span>
                  <span className="font-medium text-foreground">#18,945,672</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                iconName="ExternalLink"
                iconPosition="left"
                iconSize={12}
                className="text-xs flex-1"
              >
                View on Etherscan
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`https://etherscan.io/tx/${transactionHash}`)}
                iconName="Share"
                iconSize={12}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      )}
      {/* Verification Action Button */}
      {verificationStatus === 'pending' && onVerify && (
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVerifyClick}
            iconName="Shield"
            iconPosition="left"
            iconSize={14}
            fullWidth
            className="text-xs"
          >
            Verify on Blockchain
          </Button>
        </div>
      )}
      {/* Progress Indicator for Verifying State */}
      {verificationStatus === 'verifying' && (
        <div className="mt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Confirmation Progress</span>
              <span className="font-medium text-foreground">{confirmations}/12</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-warning h-2 rounded-full civic-transition"
                style={{ width: `${(confirmations / 12) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Compact Mobile View */}
      <div className="md:hidden">
        {verificationStatus === 'verified' && (
          <div className="flex items-center justify-between mt-2 text-xs">
            <div className="flex items-center space-x-1 text-accent">
              <Icon name="Shield" size={12} />
              <span>Verified</span>
            </div>
            <span className="text-muted-foreground">{formatHash(transactionHash)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainVerificationBadge;