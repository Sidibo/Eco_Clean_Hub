import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleAdaptiveNavbar from '../../components/ui/RoleAdaptiveNavbar';
import RoleSelectionCard from './components/RoleSelectionCard';
import RegistrationForm from './components/RegistrationForm';
import TrustIndicators from './components/TrustIndicators';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Register = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: Role Selection, 2: Registration Form
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  // Role configurations
  const roleConfigs = [
    {
      role: 'citizen',
      title: 'Citizen',
      description: 'Submit waste collection requests, track progress, and contribute to community cleanliness with blockchain-verified transparency.',
      features: [
        'Submit collection requests with photos',
        'Real-time tracking and notifications',
        'Blockchain-verified completion records',
        'Community impact dashboard',
        'Direct municipal communication'
      ],
      approvalRequired: false
    },
    {
      role: 'municipal',
      title: 'Municipal Officer',
      description: 'Manage collection operations, coordinate staff, and maintain transparent service delivery with administrative oversight capabilities.',
      features: [
        'Collection request management',
        'Staff assignment and tracking',
        'Performance analytics dashboard',
        'Blockchain completion logging',
        'Citizen communication tools'
      ],
      approvalRequired: true
    },
    {
      role: 'admin',
      title: 'Administrator',
      description: 'Full system oversight with user management, analytics, and platform configuration for comprehensive municipal waste management.',
      features: [
        'Complete user management',
        'System-wide analytics and reporting',
        'Platform configuration controls',
        'Audit trail and compliance',
        'Advanced blockchain integration'
      ],
      approvalRequired: true
    }
  ];

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const handleContinueToForm = () => {
    if (selectedRole) {
      setCurrentStep(2);
    }
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep(1);
    setSelectedRole('');
  };

  const handleRegistrationSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const registrationData = {
        ...formData,
        role: selectedRole,
        timestamp: new Date()?.toISOString(),
        status: selectedRole === 'citizen' ? 'active' : 'pending_approval'
      };

      console.log('Registration submitted:', registrationData);
      
      // Set success status
      setRegistrationStatus({
        success: true,
        role: selectedRole,
        requiresApproval: selectedRole !== 'citizen'
      });

    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationStatus({
        success: false,
        error: 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    // In a real app, this would navigate to login page
    navigate('/citizen-request-portal');
  };

  const getSelectedRoleConfig = () => {
    return roleConfigs?.find(config => config?.role === selectedRole);
  };

  // Success/Status Screen
  if (registrationStatus) {
    return (
      <div className="min-h-screen bg-background">
        <RoleAdaptiveNavbar userRole="citizen" isAuthenticated={false} />
        <div className="pt-20 pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              {registrationStatus?.success ? (
                <div className="space-y-6">
                  {/* Success Icon */}
                  <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="CheckCircle" size={48} className="text-success" />
                  </div>

                  {/* Success Message */}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground font-inter">
                      {registrationStatus?.requiresApproval ? 'Registration Submitted!' : 'Welcome to EcoClean Hub!'}
                    </h1>
                    <p className="text-lg text-muted-foreground font-inter">
                      {registrationStatus?.requiresApproval 
                        ? 'Your registration is pending administrative approval.' :'Your account has been created successfully.'
                      }
                    </p>
                  </div>

                  {/* Status Details */}
                  <div className="bg-card p-6 rounded-lg border shadow-civic">
                    {registrationStatus?.requiresApproval ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Icon name="Clock" size={20} className="text-warning" />
                          <div className="text-left">
                            <p className="font-medium text-foreground font-inter">Approval Process</p>
                            <p className="text-sm text-muted-foreground font-inter">
                              We'll review your application within 24-48 hours
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Icon name="Mail" size={20} className="text-primary" />
                          <div className="text-left">
                            <p className="font-medium text-foreground font-inter">Email Notification</p>
                            <p className="text-sm text-muted-foreground font-inter">
                              You'll receive confirmation once approved
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Icon name="Shield" size={20} className="text-success" />
                          <div className="text-left">
                            <p className="font-medium text-foreground font-inter">Account Active</p>
                            <p className="text-sm text-muted-foreground font-inter">
                              You can now access all citizen features
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {!registrationStatus?.requiresApproval && (
                      <Button
                        variant="default"
                        size="lg"
                        onClick={handleNavigateToLogin}
                        iconName="ArrowRight"
                        iconPosition="right"
                        className="w-full sm:w-auto"
                      >
                        Start Using EcoClean Hub
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setRegistrationStatus(null)}
                      className="w-full sm:w-auto"
                    >
                      Register Another Account
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Error Icon */}
                  <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="AlertCircle" size={48} className="text-error" />
                  </div>

                  {/* Error Message */}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground font-inter">
                      Registration Failed
                    </h1>
                    <p className="text-lg text-muted-foreground font-inter">
                      {registrationStatus?.error}
                    </p>
                  </div>

                  {/* Retry Button */}
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => setRegistrationStatus(null)}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleAdaptiveNavbar userRole="citizen" isAuthenticated={false} />
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground font-inter mb-4">
              Join EcoClean Hub
            </h1>
            <p className="text-xl text-muted-foreground font-inter max-w-3xl mx-auto">
              Create your account to access our smart waste management platform with AI-powered monitoring and blockchain transparency.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > 1 ? <Icon name="Check" size={16} /> : '1'}
                </div>
                <span className="text-sm font-medium">Choose Role</span>
              </div>
              
              <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Complete Registration</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Trust Indicators */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <TrustIndicators />
            </div>

            {/* Main Registration Area */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {currentStep === 1 ? (
                <div className="space-y-6">
                  {/* Role Selection */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground font-inter">
                      Select Your Role
                    </h2>
                    <p className="text-muted-foreground font-inter">
                      Choose the role that best describes your involvement with the waste management system.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {roleConfigs?.map((config) => (
                      <RoleSelectionCard
                        key={config?.role}
                        role={config?.role}
                        title={config?.title}
                        description={config?.description}
                        features={config?.features}
                        approvalRequired={config?.approvalRequired}
                        isSelected={selectedRole === config?.role}
                        onSelect={() => handleRoleSelection(config?.role)}
                      />
                    ))}
                  </div>

                  {/* Continue Button */}
                  {selectedRole && (
                    <div className="flex justify-center pt-6">
                      <Button
                        variant="default"
                        size="lg"
                        onClick={handleContinueToForm}
                        iconName="ArrowRight"
                        iconPosition="right"
                      >
                        Continue to Registration
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Form Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground font-inter">
                        Complete Your Registration
                      </h2>
                      <p className="text-muted-foreground font-inter">
                        Registering as: <span className="font-medium text-foreground capitalize">{selectedRole}</span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleBackToRoleSelection}
                      iconName="ArrowLeft"
                      iconPosition="left"
                    >
                      Change Role
                    </Button>
                  </div>

                  {/* Selected Role Summary */}
                  {selectedRole && (
                    <div className="bg-card p-4 rounded-lg border">
                      <div className="flex items-start space-x-3">
                        <Icon 
                          name={getSelectedRoleConfig()?.role === 'citizen' ? 'Users' : 
                                getSelectedRoleConfig()?.role === 'municipal' ? 'Building' : 'Shield'} 
                          size={20} 
                          className="text-primary flex-shrink-0 mt-0.5" 
                        />
                        <div>
                          <p className="font-medium text-foreground font-inter">
                            {getSelectedRoleConfig()?.title} Registration
                          </p>
                          <p className="text-sm text-muted-foreground font-inter">
                            {getSelectedRoleConfig()?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registration Form */}
                  <div className="bg-card p-6 rounded-lg border shadow-civic">
                    <RegistrationForm
                      selectedRole={selectedRole}
                      onSubmit={handleRegistrationSubmit}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;