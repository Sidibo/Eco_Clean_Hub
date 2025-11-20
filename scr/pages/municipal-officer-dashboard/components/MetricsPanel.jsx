import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const MetricsPanel = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [metrics, setMetrics] = useState({});

  // Mock metrics data
  useEffect(() => {
    const mockMetrics = {
      pending: 12,
      completed: 45,
      inProgress: 8,
      staffAvailable: 6,
      totalStaff: 10,
      avgResponseTime: '2.3 hours',
      completionRate: 87,
      urgentRequests: 3
    };
    setMetrics(mockMetrics);
  }, [timeRange]);

  // Chart data
  const dailyCollections = [
    { day: 'Mon', collections: 32, requests: 28 },
    { day: 'Tue', collections: 45, requests: 42 },
    { day: 'Wed', collections: 38, requests: 35 },
    { day: 'Thu', collections: 52, requests: 48 },
    { day: 'Fri', collections: 41, requests: 39 },
    { day: 'Sat', collections: 29, requests: 31 },
    { day: 'Sun', collections: 25, requests: 22 }
  ];

  const performanceTrend = [
    { time: '6AM', efficiency: 85 },
    { time: '9AM', efficiency: 92 },
    { time: '12PM', efficiency: 88 },
    { time: '3PM', efficiency: 95 },
    { time: '6PM', efficiency: 78 },
    { time: '9PM', efficiency: 65 }
  ];

  const binTypeDistribution = [
    { name: 'General Waste', value: 45, color: '#2563EB' },
    { name: 'Recycling', value: 30, color: '#059669' },
    { name: 'Organic', value: 20, color: '#7C3AED' },
    { name: 'Hazardous', value: 5, color: '#EF4444' }
  ];

  const MetricCard = ({ title, value, subtitle, icon, trend, color = 'text-primary' }) => (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-inter">{title}</p>
          <p className={`text-2xl font-semibold ${color} font-inter`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${color} opacity-80`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-2 text-xs">
          <Icon 
            name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
            size={12} 
            className={trend > 0 ? "text-success" : "text-error"} 
          />
          <span className={`ml-1 ${trend > 0 ? "text-success" : "text-error"}`}>
            {Math.abs(trend)}% from yesterday
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground font-inter">
          Operations Metrics
        </h2>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e?.target?.value)}
            className="text-sm border border-border rounded-md px-3 py-1 bg-background text-foreground"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button className="p-2 hover:bg-muted rounded-md civic-transition">
            <Icon name="Download" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Requests"
          value={metrics?.pending}
          subtitle="Awaiting assignment"
          icon="Clock"
          trend={-12}
          color="text-warning"
        />
        <MetricCard
          title="Completed Today"
          value={metrics?.completed}
          subtitle="Collections finished"
          icon="CheckCircle"
          trend={8}
          color="text-success"
        />
        <MetricCard
          title="In Progress"
          value={metrics?.inProgress}
          subtitle="Currently collecting"
          icon="Truck"
          trend={5}
          color="text-primary"
        />
        <MetricCard
          title="Staff Available"
          value={`${metrics?.staffAvailable}/${metrics?.totalStaff}`}
          subtitle="Active field staff"
          icon="Users"
          color="text-accent"
        />
      </div>
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">Completion Rate</h3>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full civic-transition"
                  style={{ width: `${metrics?.completionRate}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-success">{metrics?.completionRate}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Target: 90%</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">Avg Response Time</h3>
          <p className="text-xl font-semibold text-primary">{metrics?.avgResponseTime}</p>
          <p className="text-xs text-muted-foreground">Target: &lt; 3 hours</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">Urgent Requests</h3>
          <div className="flex items-center space-x-2">
            <p className="text-xl font-semibold text-error">{metrics?.urgentRequests}</p>
            <Icon name="AlertTriangle" size={16} className="text-error" />
          </div>
          <p className="text-xs text-muted-foreground">Require immediate attention</p>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Collections Chart */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-4">Daily Collections vs Requests</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyCollections}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="requests" fill="var(--color-primary)" name="Requests" />
                <Bar dataKey="collections" fill="var(--color-success)" name="Collections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-4">Efficiency Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  domain={[60, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="var(--color-accent)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-accent)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Bin Type Distribution */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-foreground mb-4">Collection Distribution by Bin Type</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={binTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {binTypeDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center space-y-3">
            {binTypeDistribution?.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-foreground flex-1">{item?.name}</span>
                <span className="text-sm font-medium text-foreground">{item?.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex items-center space-x-2 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg civic-transition">
            <Icon name="FileText" size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Generate Report</span>
          </button>
          <button className="flex items-center space-x-2 p-3 bg-success/10 hover:bg-success/20 rounded-lg civic-transition">
            <Icon name="Download" size={16} className="text-success" />
            <span className="text-sm text-success font-medium">Export Data</span>
          </button>
          <button className="flex items-center space-x-2 p-3 bg-warning/10 hover:bg-warning/20 rounded-lg civic-transition">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm text-warning font-medium">View Alerts</span>
          </button>
          <button className="flex items-center space-x-2 p-3 bg-accent/10 hover:bg-accent/20 rounded-lg civic-transition">
            <Icon name="Settings" size={16} className="text-accent" />
            <span className="text-sm text-accent font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;