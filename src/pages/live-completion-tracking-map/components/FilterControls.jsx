import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  isCollapsed, 
  onToggleCollapse,
  totalLocations = 0,
  filteredCount = 0
}) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Status', count: totalLocations },
    { value: 'pending', label: 'Pending', count: 8 },
    { value: 'in_progress', label: 'In Progress', count: 5 },
    { value: 'completed', label: 'Completed', count: 12 },
    { value: 'blockchain_verified', label: 'Blockchain Verified', count: 15 }
  ];

  const binTypeOptions = [
    { value: 'all', label: 'All Types', count: totalLocations },
    { value: 'general', label: 'General Waste', count: 18 },
    { value: 'recycling', label: 'Recycling', count: 12 },
    { value: 'organic', label: 'Organic', count: 8 },
    { value: 'hazardous', label: 'Hazardous', count: 2 }
  ];

  const staffOptions = [
    { value: 'all', label: 'All Staff', count: totalLocations },
    { value: 'John Martinez', label: 'John Martinez', count: 8 },
    { value: 'Sarah Chen', label: 'Sarah Chen', count: 7 },
    { value: 'Mike Rodriguez', label: 'Mike Rodriguez', count: 6 },
    { value: 'Lisa Thompson', label: 'Lisa Thompson', count: 5 }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities', count: totalLocations },
    { value: 'critical', label: 'Critical', count: 3 },
    { value: 'high', label: 'High', count: 8 },
    { value: 'medium', label: 'Medium', count: 15 },
    { value: 'low', label: 'Low', count: 14 }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleDateRangeChange = (type, value) => {
    const newDateRange = { ...dateRange, [type]: value };
    setDateRange(newDateRange);
    onFilterChange({ ...filters, dateRange: newDateRange });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onFilterChange({ ...filters, search: value });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      status: 'all',
      binType: 'all',
      staff: 'all',
      priority: 'all',
      dateRange: { start: '', end: '' },
      search: ''
    };
    onFilterChange(clearedFilters);
    setDateRange({ start: '', end: '' });
    setSearchTerm('');
  };

  const hasActiveFilters = () => {
    return filters?.status !== 'all' || 
           filters?.binType !== 'all' || 
           filters?.staff !== 'all' || 
           filters?.priority !== 'all' ||
           filters?.search ||
           (filters?.dateRange && (filters?.dateRange?.start || filters?.dateRange?.end));
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-civic">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground font-inter">
              Filter Controls
            </h3>
            <p className="text-xs text-muted-foreground">
              {filteredCount} of {totalLocations} locations shown
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
              className="text-xs text-error hover:text-error/80"
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
          </Button>
        </div>
      </div>
      {/* Filter Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <Input
              type="search"
              placeholder="Search by request ID, address, or staff..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e?.target?.value)}
              className="w-full"
            />
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Status</label>
              <div className="space-y-1">
                {statusOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => handleFilterChange('status', option?.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md civic-transition ${
                      filters?.status === option?.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{option?.label}</span>
                    <span className="text-xs opacity-70">({option?.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bin Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Bin Type</label>
              <div className="space-y-1">
                {binTypeOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => handleFilterChange('binType', option?.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md civic-transition ${
                      filters?.binType === option?.value
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{option?.label}</span>
                    <span className="text-xs opacity-70">({option?.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Staff Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Assigned Staff</label>
              <div className="space-y-1">
                {staffOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => handleFilterChange('staff', option?.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md civic-transition ${
                      filters?.staff === option?.value
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{option?.label}</span>
                    <span className="text-xs opacity-70">({option?.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Priority</label>
              <div className="space-y-1">
                {priorityOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => handleFilterChange('priority', option?.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md civic-transition ${
                      filters?.priority === option?.value
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{option?.label}</span>
                    <span className="text-xs opacity-70">({option?.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Date Range</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="date"
                label="Start Date"
                value={dateRange?.start}
                onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
                className="text-xs"
              />
              <Input
                type="date"
                label="End Date"
                value={dateRange?.end}
                onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters() && (
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">Active Filters:</span>
                <span className="text-xs text-primary">{filteredCount} results</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filters?.status !== 'all' && (
                  <span className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                    <span>Status: {filters?.status}</span>
                    <button onClick={() => handleFilterChange('status', 'all')}>
                      <Icon name="X" size={10} />
                    </button>
                  </span>
                )}
                {filters?.binType !== 'all' && (
                  <span className="inline-flex items-center space-x-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">
                    <span>Type: {filters?.binType}</span>
                    <button onClick={() => handleFilterChange('binType', 'all')}>
                      <Icon name="X" size={10} />
                    </button>
                  </span>
                )}
                {filters?.staff !== 'all' && (
                  <span className="inline-flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs">
                    <span>Staff: {filters?.staff}</span>
                    <button onClick={() => handleFilterChange('staff', 'all')}>
                      <Icon name="X" size={10} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;