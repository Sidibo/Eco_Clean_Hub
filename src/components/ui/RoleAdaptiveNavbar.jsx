import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleAdaptiveNavbar = ({ userRole = 'citizen', isAuthenticated = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        label: 'Submit Request',
        path: '/citizen-request-portal',
        icon: 'Camera',
        requiredRole: ['citizen', 'municipal', 'admin'],
        tooltip: 'Submit waste collection request with photo'
      },
      {
        label: 'Track Collections',
        path: '/live-completion-tracking-map',
        icon: 'MapPin',
        requiredRole: ['citizen', 'municipal', 'admin'],
        tooltip: 'Monitor collection status and progress'
      }
    ];

    const municipalItems = [
      {
        label: 'Operations Dashboard',
        path: '/municipal-officer-dashboard',
        icon: 'BarChart3',
        requiredRole: ['municipal', 'admin'],
        tooltip: 'Manage requests and coordinate staff'
      }
    ];

    const adminItems = [
      {
        label: 'Register',
        path: '/register',
        icon: 'UserPlus',
        requiredRole: ['admin'],
        tooltip: 'User registration and management'
      }
    ];

    let items = [...baseItems];
    if (userRole === 'municipal' || userRole === 'admin') {
      items = [...items, ...municipalItems];
    }
    if (userRole === 'admin') {
      items = [...items, ...adminItems];
    }

    return items?.filter(item => item?.requiredRole?.includes(userRole));
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleWeb3Connect = () => {
    setIsWeb3Connected(!isWeb3Connected);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-civic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Recycle" size={24} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-foreground font-inter">
                  EcoClean Hub
                </h1>
                <p className="text-xs text-muted-foreground font-inter">
                  Smart Waste Management
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={18}
                className="civic-transition"
                title={item?.tooltip}
              >
                {item?.label}
              </Button>
            ))}
          </nav>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Web3 Connection Badge */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isWeb3Connected ? 'bg-success' : 'bg-warning'}`} />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWeb3Connect}
                iconName={isWeb3Connected ? "Shield" : "ShieldAlert"}
                iconPosition="left"
                iconSize={16}
                className="text-xs"
              >
                {isWeb3Connected ? 'Blockchain Verified' : 'Connect Wallet'}
              </Button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                iconName="Bell"
                iconSize={20}
                className="relative"
              >
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {notifications}
                  </span>
                )}
              </Button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-foreground capitalize">
                  {userRole} User
                </p>
                <p className="text-xs text-muted-foreground">
                  {userRole === 'citizen' ? 'Community Member' : 
                   userRole === 'municipal' ? 'Municipal Officer' : 'Administrator'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                iconName="User"
                iconSize={20}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                iconName="Bell"
                iconSize={20}
                className="relative"
              >
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              iconName={isMobileMenuOpen ? "X" : "Menu"}
              iconSize={20}
            />
          </div>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-civic z-40">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Items */}
            <nav className="space-y-2">
              {navigationItems?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isActivePath(item?.path) ? "default" : "ghost"}
                  onClick={() => handleNavigation(item?.path)}
                  iconName={item?.icon}
                  iconPosition="left"
                  iconSize={20}
                  fullWidth
                  className="justify-start civic-transition"
                >
                  <span className="ml-3">{item?.label}</span>
                </Button>
              ))}
            </nav>

            {/* Mobile Web3 Status */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleWeb3Connect}
                iconName={isWeb3Connected ? "Shield" : "ShieldAlert"}
                iconPosition="left"
                iconSize={18}
                fullWidth
                className="justify-start"
              >
                <span className="ml-3">
                  {isWeb3Connected ? 'Blockchain Connected' : 'Connect Wallet'}
                </span>
                <div className={`ml-auto w-2 h-2 rounded-full ${isWeb3Connected ? 'bg-success' : 'bg-warning'}`} />
              </Button>
            </div>

            {/* Mobile User Info */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center space-x-3 px-3 py-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {userRole} User
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userRole === 'citizen' ? 'Community Member' : 
                     userRole === 'municipal' ? 'Municipal Officer' : 'Administrator'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Quick Actions Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 px-4 py-2">
        <div className="flex items-center justify-around">
          {/* Camera Quick Access for Citizens */}
          {userRole === 'citizen' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/citizen-request-portal')}
              iconName="Camera"
              iconPosition="left"
              iconSize={16}
              className="flex-1 mx-1"
            >
              Quick Submit
            </Button>
          )}
          
          {/* Status Update for Municipal */}
          {(userRole === 'municipal' || userRole === 'admin') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/municipal-officer-dashboard')}
              iconName="CheckCircle"
              iconPosition="left"
              iconSize={16}
              className="flex-1 mx-1"
            >
              Update Status
            </Button>
          )}

          {/* Map View */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation('/live-completion-tracking-map')}
            iconName="MapPin"
            iconPosition="left"
            iconSize={16}
            className="flex-1 mx-1"
          >
            Map View
          </Button>
        </div>
      </div>
    </header>
  );
};

export default RoleAdaptiveNavbar;