import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LiveCompletionTrackingMap from './pages/live-completion-tracking-map';
import MunicipalOfficerDashboard from './pages/municipal-officer-dashboard';
import CitizenRequestPortal from './pages/citizen-request-portal';
import Register from './pages/register';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CitizenRequestPortal />} />
        <Route path="/live-completion-tracking-map" element={<LiveCompletionTrackingMap />} />
        <Route path="/municipal-officer-dashboard" element={<MunicipalOfficerDashboard />} />
        <Route path="/citizen-request-portal" element={<CitizenRequestPortal />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
