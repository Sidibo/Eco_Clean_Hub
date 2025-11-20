import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RequestForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    description: '',
    urgencyLevel: 'standard',
    estimatedFillLevel: '',
    contactMethod: 'app'
  });

  const urgencyOptions = [
    { 
      value: 'standard', 
      label: 'Standard Collection',
      description: 'Regular pickup schedule (24-48 hours)'
    },
    { 
      value: 'urgent', 
      label: 'Urgent Request',
      description: 'Priority pickup needed (within 12 hours)'
    },
    { 
      value: 'overflow', 
      label: 'Overflow Emergency',
      description: 'Immediate attention required (within 4 hours)'
    }
  ];

  const fillLevelOptions = [
    { value: '', label: 'Let AI determine automatically' },
    { value: '25', label: '25% - Quarter full' },
    { value: '50', label: '50% - Half full' },
    { value: '75', label: '75% - Nearly full' },
    { value: '100', label: '100% - Completely full' },
    { value: 'overflow', label: 'Overflowing' }
  ];

  const contactMethodOptions = [
    { 
      value: 'app', 
      label: 'App Notifications',
      description: 'Receive updates through the app'
    },
    { 
      value: 'sms', 
      label: 'SMS Messages',
      description: 'Text message notifications'
    },
    { 
      value: 'email', 
      label: 'Email Updates',
      description: 'Email notifications and receipts'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit(formData);
  };

  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'urgent': return 'Clock';
      case 'overflow': return 'AlertTriangle';
      default: return 'Calendar';
    }
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'urgent': return 'text-warning';
      case 'overflow': return 'text-error';
      default: return 'text-primary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground font-inter">
            Request Details
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Provide additional information to help our collection team
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Urgency Level */}
          <div className="space-y-3">
            <Select
              label="Collection Priority"
              description="Select the urgency level for this request"
              options={urgencyOptions}
              value={formData?.urgencyLevel}
              onChange={(value) => handleInputChange('urgencyLevel', value)}
              required
            />
            
            {/* Urgency Level Visual Indicator */}
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              formData?.urgencyLevel === 'overflow' ? 'bg-error/10 border border-error/20' :
              formData?.urgencyLevel === 'urgent'? 'bg-warning/10 border border-warning/20' : 'bg-primary/10 border border-primary/20'
            }`}>
              <Icon 
                name={getUrgencyIcon(formData?.urgencyLevel)} 
                size={16} 
                className={getUrgencyColor(formData?.urgencyLevel)} 
              />
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {urgencyOptions?.find(opt => opt?.value === formData?.urgencyLevel)?.label}
                </p>
                <p className="text-muted-foreground text-xs">
                  {urgencyOptions?.find(opt => opt?.value === formData?.urgencyLevel)?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Estimated Fill Level */}
          <Select
            label="Estimated Fill Level (Optional)"
            description="Override AI analysis if you have a better assessment"
            options={fillLevelOptions}
            value={formData?.estimatedFillLevel}
            onChange={(value) => handleInputChange('estimatedFillLevel', value)}
          />

          {/* Description */}
          <div className="space-y-2">
            <Input
              label="Additional Notes (Optional)"
              type="text"
              placeholder="Describe any special circumstances, accessibility issues, or additional context..."
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              description="Help our team understand any special requirements"
            />
            <div className="text-xs text-muted-foreground">
              {formData?.description?.length}/500 characters
            </div>
          </div>

          {/* Contact Method */}
          <Select
            label="Preferred Notification Method"
            description="How would you like to receive updates about this request?"
            options={contactMethodOptions}
            value={formData?.contactMethod}
            onChange={(value) => handleInputChange('contactMethod', value)}
            required
          />

          {/* AI Analysis Preview */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-accent">
                <Icon name="Zap" size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground font-inter">
                  AI Analysis Ready
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Our AI will analyze your uploaded image to determine bin fill level, 
                  waste type classification, and optimal collection scheduling. 
                  Results will be available immediately after submission.
                </p>
              </div>
            </div>
          </div>

          {/* Blockchain Notice */}
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-secondary">
                <Icon name="Shield" size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground font-inter">
                  Blockchain Verification
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  This request will be recorded on the Ethereum blockchain for 
                  transparency and accountability. You'll receive a verification 
                  link once the collection is completed.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-border">
            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isSubmitting}
              iconName="Send"
              iconPosition="left"
              iconSize={18}
              className="touch-target"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Collection Request'}
            </Button>
          </div>

          {/* Form Footer */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By submitting this request, you agree to our{' '}
              <button className="text-primary hover:underline">Terms of Service</button>
              {' '}and{' '}
              <button className="text-primary hover:underline">Privacy Policy</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;