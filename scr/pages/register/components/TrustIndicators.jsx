import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'Your data is encrypted and protected',
      color: 'text-success'
    },
    {
      icon: 'CheckCircle',
      title: 'Municipal Certified',
      description: 'Official city waste management platform',
      color: 'text-primary'
    },
    {
      icon: 'Lock',
      title: 'Blockchain Verified',
      description: 'Immutable transparency and accountability',
      color: 'text-accent'
    }
  ];

  const statistics = [
    { label: 'Active Citizens', value: '12,847', icon: 'Users' },
    { label: 'Collections Completed', value: '45,293', icon: 'CheckCircle' },
    { label: 'Transparency Score', value: '99.8%', icon: 'Shield' }
  ];

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground font-inter">
          Security & Trust
        </h3>
        
        {trustBadges?.map((badge, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-card rounded-lg border">
            <div className={badge?.color}>
              <Icon name={badge?.icon} size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground font-inter">
                {badge?.title}
              </p>
              <p className="text-xs text-muted-foreground font-inter">
                {badge?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Platform Statistics */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground font-inter">
          Platform Impact
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {statistics?.map((stat, index) => (
            <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center space-x-2">
                <Icon name={stat?.icon} size={16} className="text-primary" />
                <div>
                  <p className="text-lg font-bold text-primary font-inter">
                    {stat?.value}
                  </p>
                  <p className="text-xs text-muted-foreground font-inter">
                    {stat?.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Municipal Certification */}
      <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Award" size={16} color="white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground font-inter mb-1">
              Official Municipal Platform
            </p>
            <p className="text-xs text-muted-foreground font-inter">
              Certified by the City Environmental Department and integrated with official waste management systems for complete transparency and accountability.
            </p>
          </div>
        </div>
      </div>
      {/* Contact Support */}
      <div className="text-center p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground font-inter mb-2">
          Need help with registration?
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs">
          <button className="flex items-center space-x-1 text-primary hover:text-primary/80 civic-transition">
            <Icon name="Mail" size={12} />
            <span>Email Support</span>
          </button>
          <button className="flex items-center space-x-1 text-primary hover:text-primary/80 civic-transition">
            <Icon name="Phone" size={12} />
            <span>Call (555) 0123</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;