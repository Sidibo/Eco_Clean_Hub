import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleSelectionCard = ({ 
  role, 
  title, 
  description, 
  features, 
  approvalRequired, 
  isSelected, 
  onSelect 
}) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case 'citizen':
        return 'Users';
      case 'municipal':
        return 'Building';
      case 'admin':
        return 'Shield';
      default:
        return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'citizen':
        return 'text-primary';
      case 'municipal':
        return 'text-secondary';
      case 'admin':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative p-6 rounded-lg border-2 cursor-pointer civic-transition ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-civic'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-civic'
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} color="white" />
          </div>
        </div>
      )}
      {/* Role Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className={`${getRoleColor(role)}`}>
          <Icon name={getRoleIcon(role)} size={32} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground font-inter">
            {title}
          </h3>
          {approvalRequired && (
            <span className="inline-flex items-center space-x-1 text-xs text-warning bg-warning/10 px-2 py-1 rounded-full mt-1">
              <Icon name="Clock" size={12} />
              <span>Approval Required</span>
            </span>
          )}
        </div>
      </div>
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 font-inter">
        {description}
      </p>
      {/* Features List */}
      <div className="space-y-2">
        {features?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={14} className="text-success flex-shrink-0" />
            <span className="text-xs text-foreground font-inter">{feature}</span>
          </div>
        ))}
      </div>
      {/* Approval Notice */}
      {approvalRequired && (
        <div className="mt-4 p-3 bg-warning/10 rounded-md border border-warning/20">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={14} className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-warning font-inter">
              Registration requires administrative approval. You'll receive email notification once approved.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionCard;