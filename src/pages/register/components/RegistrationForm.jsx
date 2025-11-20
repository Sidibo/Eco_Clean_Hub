import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ selectedRole, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    neighborhood: '',
    employeeId: '',
    department: '',
    agreeToTerms: false,
    enableWeb3: false
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Department options for municipal officers
  const departmentOptions = [
    { value: 'waste_management', label: 'Waste Management' },
    { value: 'sanitation', label: 'Sanitation Department' },
    { value: 'public_works', label: 'Public Works' },
    { value: 'environmental', label: 'Environmental Services' },
    { value: 'operations', label: 'Operations Management' }
  ];

  // Neighborhood options
  const neighborhoodOptions = [
    { value: 'downtown', label: 'Downtown District' },
    { value: 'riverside', label: 'Riverside Area' },
    { value: 'hillview', label: 'Hillview Heights' },
    { value: 'greenpark', label: 'Green Park' },
    { value: 'industrial', label: 'Industrial Zone' },
    { value: 'residential_north', label: 'North Residential' },
    { value: 'residential_south', label: 'South Residential' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Password strength calculation
    if (field === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (/[A-Z]/?.test(password)) strength += 25;
    if (/[0-9]/?.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/?.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData?.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Invalid email format';
    if (!formData?.password) newErrors.password = 'Password is required';
    if (formData?.password?.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData?.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData?.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    // Role-specific validation
    if (selectedRole === 'citizen') {
      if (!formData?.address?.trim()) newErrors.address = 'Address is required';
      if (!formData?.neighborhood) newErrors.neighborhood = 'Neighborhood selection is required';
    }

    if (selectedRole === 'municipal' || selectedRole === 'admin') {
      if (!formData?.employeeId?.trim()) newErrors.employeeId = 'Employee ID is required';
      if (!formData?.department) newErrors.department = 'Department selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-error';
    if (passwordStrength < 75) return 'bg-warning';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground font-inter">
          Basic Information
        </h3>

        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={(e) => handleInputChange('fullName', e?.target?.value)}
          error={errors?.fullName}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          description="We'll send verification instructions to this email"
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          value={formData?.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e?.target?.value)}
          error={errors?.phoneNumber}
          required
        />
      </div>
      {/* Password Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground font-inter">
          Security
        </h3>

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
          />
          {formData?.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Password Strength</span>
                <span className={`font-medium ${
                  passwordStrength < 50 ? 'text-error' : 
                  passwordStrength < 75 ? 'text-warning' : 'text-success'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full civic-transition ${getPasswordStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
      </div>
      {/* Role-Specific Fields */}
      {selectedRole === 'citizen' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground font-inter">
            Location Information
          </h3>

          <Input
            label="Address"
            type="text"
            placeholder="Enter your full address"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            error={errors?.address}
            description="This helps us provide location-specific services"
            required
          />

          <Select
            label="Neighborhood"
            placeholder="Select your neighborhood"
            options={neighborhoodOptions}
            value={formData?.neighborhood}
            onChange={(value) => handleInputChange('neighborhood', value)}
            error={errors?.neighborhood}
            required
          />
        </div>
      )}
      {(selectedRole === 'municipal' || selectedRole === 'admin') && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground font-inter">
            Employment Information
          </h3>

          <Input
            label="Employee ID"
            type="text"
            placeholder="Enter your employee ID"
            value={formData?.employeeId}
            onChange={(e) => handleInputChange('employeeId', e?.target?.value)}
            error={errors?.employeeId}
            description="Your official municipal employee identification"
            required
          />

          <Select
            label="Department"
            placeholder="Select your department"
            options={departmentOptions}
            value={formData?.department}
            onChange={(value) => handleInputChange('department', value)}
            error={errors?.department}
            required
          />
        </div>
      )}
      {/* Web3 Integration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground font-inter">
          Blockchain Features
        </h3>

        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
          <Checkbox
            label="Enable Web3 Wallet Integration"
            description="Connect your wallet for blockchain-verified transactions and transparency features"
            checked={formData?.enableWeb3}
            onChange={(e) => handleInputChange('enableWeb3', e?.target?.checked)}
          />
          
          {formData?.enableWeb3 && (
            <div className="mt-3 p-3 bg-card rounded-md border">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Blockchain Benefits:</p>
                  <ul className="space-y-1">
                    <li>• Immutable completion records</li>
                    <li>• Transparent collection tracking</li>
                    <li>• Corruption-proof verification</li>
                    <li>• Decentralized data integrity</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            checked={formData?.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
            error={errors?.agreeToTerms}
            required
          />
          
          <div className="mt-3 text-xs text-muted-foreground space-x-4">
            <button type="button" className="text-primary hover:text-primary/80 civic-transition">
              Read Terms of Service
            </button>
            <button type="button" className="text-primary hover:text-primary/80 civic-transition">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
        disabled={!formData?.agreeToTerms}
      >
        {selectedRole === 'citizen' ? 'Create Account' : 'Submit for Approval'}
      </Button>
      {/* Additional Info */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <button type="button" className="text-primary hover:text-primary/80 civic-transition font-medium">
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;