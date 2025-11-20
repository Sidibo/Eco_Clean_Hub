import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIAnalysisStatus = ({ isAnalyzing, analysisResults, onRetryAnalysis }) => {
  const [analysisStep, setAnalysisStep] = useState(0);
  const [confidence, setConfidence] = useState(0);

  const analysisSteps = [
    { label: 'Image Processing', icon: 'Image', duration: 1000 },
    { label: 'Object Detection', icon: 'Scan', duration: 1500 },
    { label: 'Fill Level Analysis', icon: 'BarChart3', duration: 2000 },
    { label: 'Classification Complete', icon: 'CheckCircle', duration: 500 }
  ];

  useEffect(() => {
    if (isAnalyzing) {
      setAnalysisStep(0);
      setConfidence(0);
      
      const stepInterval = setInterval(() => {
        setAnalysisStep(prev => {
          if (prev < analysisSteps?.length - 1) {
            return prev + 1;
          } else {
            clearInterval(stepInterval);
            return prev;
          }
        });
      }, 1200);

      const confidenceInterval = setInterval(() => {
        setConfidence(prev => {
          if (prev < 95) {
            return prev + Math.random() * 15;
          }
          return 95;
        });
      }, 200);

      return () => {
        clearInterval(stepInterval);
        clearInterval(confidenceInterval);
      };
    }
  }, [isAnalyzing]);

  if (!isAnalyzing && !analysisResults) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
            <Icon name="Zap" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground font-inter">
              AI Analysis Ready
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upload an image to begin automated waste bin analysis
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Icon name="Zap" size={32} className="text-accent animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-inter">
              AI Analysis in Progress
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Analyzing your image with advanced computer vision
            </p>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-3">
            {analysisSteps?.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg civic-transition ${
                  index <= analysisStep
                    ? index === analysisStep
                      ? 'bg-accent/10 border border-accent/20' :'bg-success/10 border border-success/20' :'bg-muted/30'
                }`}
              >
                <div className={`${
                  index < analysisStep
                    ? 'text-success'
                    : index === analysisStep
                    ? 'text-accent' :'text-muted-foreground'
                }`}>
                  <Icon 
                    name={index < analysisStep ? 'CheckCircle' : step?.icon} 
                    size={20}
                    className={index === analysisStep ? 'animate-pulse' : ''}
                  />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    index <= analysisStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step?.label}
                  </p>
                </div>
                {index === analysisStep && (
                  <div className="text-xs text-accent font-medium">
                    Processing...
                  </div>
                )}
                {index < analysisStep && (
                  <div className="text-xs text-success font-medium">
                    Complete
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Confidence Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Analysis Confidence</span>
              <span className="font-medium text-foreground">{Math.round(confidence)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full civic-transition"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground font-inter">
            Analysis Results
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetryAnalysis}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={16}
          >
            Re-analyze
          </Button>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="text-primary">
                <Icon name="BarChart3" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Fill Level</p>
                <p className="text-lg font-semibold text-primary">
                  {analysisResults?.fillLevel || '85%'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="text-success">
                <Icon name="CheckCircle" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Confidence</p>
                <p className="text-lg font-semibold text-success">
                  {analysisResults?.confidence || '94%'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground font-inter mb-3">
              Detection Results
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Waste Type</p>
                <p className="font-medium text-foreground">
                  {analysisResults?.wasteType || 'Mixed Household'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Bin Condition</p>
                <p className="font-medium text-foreground">
                  {analysisResults?.binCondition || 'Good'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Overflow Risk</p>
                <p className={`font-medium ${
                  (analysisResults?.overflowRisk || 'High') === 'High' ? 'text-error' : 
                  (analysisResults?.overflowRisk || 'High') === 'Medium' ? 'text-warning' : 'text-success'
                }`}>
                  {analysisResults?.overflowRisk || 'High'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Recommended Action</p>
                <p className="font-medium text-primary">
                  {analysisResults?.recommendation || 'Urgent Collection'}
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-accent">
                <Icon name="Brain" size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground font-inter">
                  AI Insights
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {analysisResults?.insights || 
                    `The bin appears to be nearly full with mixed household waste. Based on the fill level and waste composition, collection is recommended within the next 12 hours to prevent overflow. The bin condition is good with no visible damage.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Scheduling Recommendation */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-warning">
                <Icon name="Clock" size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground font-inter">
                  Collection Scheduling
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on AI analysis, this bin should be collected within{' '}
                  <span className="font-medium text-warning">12 hours</span> to prevent overflow.
                  Estimated collection time: <span className="font-medium text-foreground">Tomorrow 8:00 AM</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisStatus;