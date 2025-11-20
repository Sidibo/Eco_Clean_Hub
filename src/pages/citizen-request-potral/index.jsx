import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleAdaptiveNavbar from '../../components/ui/RoleAdaptiveNavbar';
import RequestStatusIndicator from '../../components/ui/RequestStatusIndicator';
import Web3ConnectionBadge from '../../components/ui/Web3ConnectionBadge';
import NotificationCenter from '../../components/ui/NotificationCenter';
import ImageUploadZone from './components/ImageUploadZone';
import LocationSelector from './components/LocationSelector';
import RequestForm from './components/RequestForm';
import AIAnalysisStatus from './components/AIAnalysisStatus';
import RequestHistory from './components/RequestHistory';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CitizenRequestPortal = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  // Mock user data
  const userRole = 'citizen';
  const requestStats = {
    requestCount: 12,
    completedCount: 8,
    pendingCount: 4
  };

  // Auto-trigger AI analysis when image is selected
  useEffect(() => {
    if (selectedImage && !isAnalyzing && !analysisResults) {
      setTimeout(() => {
        setIsAnalyzing(true);
        
        // Simulate AI analysis completion
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisResults({
            fillLevel: '85%',
            confidence: '94%',
            wasteType: 'Mixed Household',
            binCondition: 'Good',
            overflowRisk: 'High',
            recommendation: 'Urgent Collection',
            insights: 'The bin appears to be nearly full with mixed household waste. Based on the fill level and waste composition, collection is recommended within the next 12 hours to prevent overflow. The bin condition is good with no visible damage.'
          });
        }, 5000);
      }, 1000);
    }
  }, [selectedImage, isAnalyzing, analysisResults]);

  const handleImageSelect = (imageData) => {
    setSelectedImage(imageData);
    setAnalysisResults(null);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setAnalysisResults(null);
    setIsAnalyzing(false);
  };

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
  };

  const handleRetryAnalysis = () => {
    setAnalysisResults(null);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResults({
        fillLevel: '82%',
        confidence: '96%',
        wasteType: 'Mixed Household',
        binCondition: 'Good',
        overflowRisk: 'High',
        recommendation: 'Urgent Collection',
        insights: 'Updated analysis confirms high fill level with improved confidence. Collection recommended within 12 hours.'
      });
    }, 3000);
  };

  const handleFormSubmit = async (formData) => {
    if (!selectedImage || !selectedLocation) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newRequest = {
        id: `REQ-${Date.now()}`,
        timestamp: new Date(),
        image: selectedImage,
        location: selectedLocation,
        analysisResults,
        formData,
        status: 'pending',
        estimatedCollection: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours from now
      };

      setSubmittedRequest(newRequest);
      setShowSuccessModal(true);

      // Reset form
      setSelectedImage(null);
      setSelectedLocation(null);
      setAnalysisResults(null);
      
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWeb3Connect = async () => {
    setIsWeb3Connected(true);
  };

  const handleWeb3Disconnect = () => {
    setIsWeb3Connected(false);
  };

  const canSubmitRequest = selectedImage && selectedLocation && analysisResults && !isAnalyzing;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <RoleAdaptiveNavbar 
        userRole={userRole}
        isAuthenticated={true}
      />
      {/* Main Content */}
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Camera" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground font-inter">
                  Submit Collection Request
                </h1>
                <p className="text-muted-foreground">
                  Upload a photo of your waste bin for AI-powered analysis and automated scheduling
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RequestStatusIndicator
                userRole={userRole}
                requestCount={requestStats?.requestCount}
                completedCount={requestStats?.completedCount}
                pendingCount={requestStats?.pendingCount}
              />
              
              <Web3ConnectionBadge
                isConnected={isWeb3Connected}
                onConnect={handleWeb3Connect}
                onDisconnect={handleWeb3Disconnect}
                walletAddress="0x742d35Cc6634C0532925a3b8D4C2F2b2b8b8b8b8"
                blockchainNetwork="Ethereum"
              />

              <div className="flex justify-end">
                <NotificationCenter
                  userRole={userRole}
                  notifications={[]}
                  onMarkAsRead={() => {}}
                  onMarkAllAsRead={() => {}}
                  onNotificationClick={() => {}}
                />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Request Submission */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Upload */}
              <ImageUploadZone
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onImageRemove={handleImageRemove}
              />

              {/* Location Selection */}
              <LocationSelector
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
              />

              {/* AI Analysis Status */}
              <AIAnalysisStatus
                isAnalyzing={isAnalyzing}
                analysisResults={analysisResults}
                onRetryAnalysis={handleRetryAnalysis}
              />

              {/* Request Form */}
              {canSubmitRequest && (
                <RequestForm
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* Submit Button (Mobile) */}
              <div className="lg:hidden">
                {canSubmitRequest && (
                  <div className="sticky bottom-20 z-10">
                    <div className="bg-card border border-border rounded-lg p-4 shadow-civic-lg">
                      <Button
                        variant="default"
                        size="lg"
                        fullWidth
                        loading={isSubmitting}
                        iconName="Send"
                        iconPosition="left"
                        iconSize={18}
                        onClick={() => {
                          const form = document.querySelector('form');
                          if (form) form?.requestSubmit();
                        }}
                      >
                        Submit Collection Request
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Request History */}
            <div className="space-y-6">
              <RequestHistory userRole={userRole} />

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground font-inter mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="MapPin"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => navigate('/live-completion-tracking-map')}
                  >
                    Track Collections
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="BarChart3"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => navigate('/municipal-officer-dashboard')}
                  >
                    View Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="FileText"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Download Reports
                  </Button>
                </div>
              </div>

              {/* Help & Support */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="HelpCircle" size={20} className="text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground font-inter">
                      Need Help?
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">
                      Learn how to take the best photos for accurate AI analysis
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ExternalLink"
                      iconPosition="right"
                      iconSize={12}
                      className="text-xs"
                    >
                      View Photo Guidelines
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Success Modal */}
      {showSuccessModal && submittedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 animate-civic-slide-in">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground font-inter">
                  Request Submitted Successfully!
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Your waste collection request has been submitted and is being processed.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Request ID:</span>
                    <span className="font-medium text-foreground">{submittedRequest?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-primary">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Collection:</span>
                    <span className="font-medium text-foreground">
                      {submittedRequest?.estimatedCollection?.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSuccessModal(false)}
                  fullWidth
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/live-completion-tracking-map');
                  }}
                  iconName="MapPin"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                >
                  Track Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenRequestPortal;