import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LocationSelector = ({ onLocationSelect, selectedLocation }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Mock current location for demo
  const mockLocation = {
    latitude: 40.7128,
    longitude: -74.0060,
    address: "123 Main Street, New York, NY 10001",
    accuracy: 10
  };

  useEffect(() => {
    if (selectedLocation) {
      setManualAddress(selectedLocation?.address);
    }
  }, [selectedLocation]);

  const detectCurrentLocation = () => {
    setIsDetecting(true);
    setLocationError('');

    // Simulate GPS detection
    setTimeout(() => {
      if (navigator.geolocation) {
        // In a real app, this would use actual geolocation
        onLocationSelect(mockLocation);
        setIsDetecting(false);
      } else {
        setLocationError('Geolocation is not supported by this browser');
        setIsDetecting(false);
      }
    }, 2000);
  };

  const handleManualSubmit = () => {
    if (manualAddress?.trim()) {
      // In a real app, this would geocode the address
      const manualLocation = {
        latitude: 40.7589,
        longitude: -73.9851,
        address: manualAddress,
        accuracy: null,
        isManual: true
      };
      onLocationSelect(manualLocation);
      setShowManualInput(false);
    }
  };

  const clearLocation = () => {
    onLocationSelect(null);
    setManualAddress('');
    setShowManualInput(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground font-inter">
            Bin Location
          </h3>
          {selectedLocation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLocation}
              iconName="X"
              iconPosition="left"
              iconSize={16}
              className="text-error hover:text-error/80"
            >
              Clear
            </Button>
          )}
        </div>

        {selectedLocation ? (
          <div className="space-y-4">
            {/* Selected Location Display */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-success">
                  <Icon name="MapPin" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Location Confirmed
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedLocation?.address}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>Lat: {selectedLocation?.latitude?.toFixed(6)}</span>
                    <span>Lng: {selectedLocation?.longitude?.toFixed(6)}</span>
                    {selectedLocation?.accuracy && (
                      <span>±{selectedLocation?.accuracy}m</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Waste Bin Location"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${selectedLocation?.latitude},${selectedLocation?.longitude}&z=16&output=embed`}
                className="border-0"
              />
              <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm rounded-md px-2 py-1">
                <div className="flex items-center space-x-1 text-xs">
                  <Icon name="MapPin" size={12} className="text-primary" />
                  <span className="text-foreground font-medium">Bin Location</span>
                </div>
              </div>
            </div>

            {/* Location Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={detectCurrentLocation}
                iconName="Navigation"
                iconPosition="left"
                iconSize={16}
                fullWidth
                disabled={isDetecting}
              >
                Update Location
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowManualInput(true)}
                iconName="Edit"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                Edit Address
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Location Detection */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Icon 
                  name={isDetecting ? "Loader2" : "MapPin"} 
                  size={32} 
                  className={`text-primary ${isDetecting ? 'animate-spin' : ''}`} 
                />
              </div>

              <div>
                <h4 className="text-lg font-medium text-foreground font-inter">
                  {isDetecting ? 'Detecting Location...' : 'Set Bin Location'}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {isDetecting 
                    ? 'Please wait while we detect your current location'
                    : 'Help us locate the waste bin for accurate collection scheduling'
                  }
                </p>
              </div>

              {locationError && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error" />
                    <p className="text-sm text-error">{locationError}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location Options */}
            <div className="space-y-3">
              <Button
                variant="default"
                onClick={detectCurrentLocation}
                iconName="Navigation"
                iconPosition="left"
                iconSize={18}
                fullWidth
                disabled={isDetecting}
                loading={isDetecting}
                className="touch-target"
              >
                Use Current Location
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowManualInput(true)}
                iconName="MapPin"
                iconPosition="left"
                iconSize={18}
                fullWidth
                className="touch-target"
              >
                Enter Address Manually
              </Button>
            </div>
          </div>
        )}

        {/* Manual Address Input */}
        {showManualInput && (
          <div className="space-y-3 pt-4 border-t border-border">
            <Input
              label="Bin Address"
              type="text"
              placeholder="Enter street address, city, state"
              value={manualAddress}
              onChange={(e) => setManualAddress(e?.target?.value)}
              description="Provide the exact location of the waste bin"
            />
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowManualInput(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleManualSubmit}
                iconName="Check"
                iconPosition="left"
                iconSize={16}
                fullWidth
                disabled={!manualAddress?.trim()}
              >
                Confirm Address
              </Button>
            </div>
          </div>
        )}

        {/* Location Tips */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Location Tips:</p>
              <ul className="space-y-1">
                <li>• Ensure you're near the actual waste bin</li>
                <li>• GPS accuracy improves collection efficiency</li>
                <li>• Manual addresses help when GPS is unavailable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;