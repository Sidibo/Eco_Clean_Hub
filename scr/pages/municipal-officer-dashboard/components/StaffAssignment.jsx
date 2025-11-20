import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Image from '../../../components/AppImage';

const StaffAssignment = ({ selectedRequests = [], onAssignmentComplete }) => {
  const [availableStaff, setAvailableStaff] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [workloadBalance, setWorkloadBalance] = useState({});

  // Mock staff data
  useEffect(() => {
    const mockStaff = [
    {
      id: 'STAFF-001',
      name: 'John Martinez',
      role: 'Collection Supervisor',
      status: 'available',
      currentLoad: 2,
      maxCapacity: 8,
      skills: ['Heavy Waste', 'Hazardous Materials'],
      location: 'Downtown District',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d29504f2-1763294463041.png",
      avatarAlt: 'Professional headshot of Hispanic man with short black hair wearing safety vest',
      rating: 4.8,
      completedToday: 12,
      vehicleType: 'Truck - Large'
    },
    {
      id: 'STAFF-002',
      name: 'Sarah Chen',
      role: 'Collection Specialist',
      status: 'available',
      currentLoad: 1,
      maxCapacity: 6,
      skills: ['Recycling', 'Organic Waste'],
      location: 'Midtown District',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_14aa24e0a-1763301849653.png",
      avatarAlt: 'Professional headshot of Asian woman with long black hair in municipal uniform',
      rating: 4.9,
      completedToday: 8,
      vehicleType: 'Van - Medium'
    },
    {
      id: 'STAFF-003',
      name: 'Michael Johnson',
      role: 'Collection Driver',
      status: 'busy',
      currentLoad: 5,
      maxCapacity: 6,
      skills: ['General Waste', 'Bulk Items'],
      location: 'Uptown District',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_101b4d711-1763291923733.png",
      avatarAlt: 'Professional headshot of African American man with beard wearing work uniform',
      rating: 4.6,
      completedToday: 15,
      vehicleType: 'Truck - Medium'
    },
    {
      id: 'STAFF-004',
      name: 'Emily Rodriguez',
      role: 'Collection Specialist',
      status: 'available',
      currentLoad: 0,
      maxCapacity: 5,
      skills: ['Recycling', 'Small Items'],
      location: 'Eastside District',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1612278f8-1763294059882.png",
      avatarAlt: 'Professional headshot of Latina woman with brown hair in safety equipment',
      rating: 4.7,
      completedToday: 6,
      vehicleType: 'Van - Small'
    }];

    setAvailableStaff(mockStaff);

    // Calculate workload balance
    const balance = {};
    mockStaff?.forEach((staff) => {
      balance[staff.id] = {
        utilization: staff?.currentLoad / staff?.maxCapacity * 100,
        efficiency: staff?.rating * 20
      };
    });
    setWorkloadBalance(balance);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':return 'text-success bg-success/10';
      case 'busy':return 'text-warning bg-warning/10';
      case 'offline':return 'text-error bg-error/10';
      default:return 'text-muted-foreground bg-muted/10';
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization > 80) return 'bg-error';
    if (utilization > 60) return 'bg-warning';
    return 'bg-success';
  };

  const handleStaffAssignment = (requestId, staffId) => {
    setAssignments((prev) => ({
      ...prev,
      [requestId]: staffId
    }));
  };

  const handleBulkAssignment = () => {
    // Auto-assign based on workload and location
    const newAssignments = {};
    selectedRequests?.forEach((request) => {
      const bestStaff = findOptimalStaff(request);
      if (bestStaff) {
        newAssignments[request.id] = bestStaff?.id;
      }
    });
    setAssignments((prev) => ({ ...prev, ...newAssignments }));
  };

  const findOptimalStaff = (request) => {
    return availableStaff?.filter((staff) => staff?.status === 'available' && staff?.currentLoad < staff?.maxCapacity)?.sort((a, b) => {
      const aUtilization = workloadBalance?.[a?.id]?.utilization || 0;
      const bUtilization = workloadBalance?.[b?.id]?.utilization || 0;
      return aUtilization - bUtilization;
    })?.[0];
  };

  const confirmAssignments = () => {
    if (onAssignmentComplete) {
      onAssignmentComplete(assignments);
    }
    setAssignments({});
  };

  const staffOptions = availableStaff?.filter((staff) => staff?.status === 'available')?.map((staff) => ({
    value: staff?.id,
    label: `${staff?.name} (${staff?.currentLoad}/${staff?.maxCapacity})`,
    description: `${staff?.role} - ${staff?.location}`
  }));

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground font-inter">
            Staff Assignment
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Zap"
              iconPosition="left"
              iconSize={16}
              onClick={handleBulkAssignment}
              disabled={selectedRequests?.length === 0}>

              Auto Assign
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="CheckCircle"
              iconPosition="left"
              iconSize={16}
              onClick={confirmAssignments}
              disabled={Object.keys(assignments)?.length === 0}>

              Confirm ({Object.keys(assignments)?.length})
            </Button>
          </div>
        </div>

        {selectedRequests?.length > 0 &&
        <div className="text-sm text-muted-foreground">
            Assigning {selectedRequests?.length} requests to available staff
          </div>
        }
      </div>
      {/* Staff List */}
      <div className="p-4 space-y-4">
        {availableStaff?.map((staff) =>
        <div
          key={staff?.id}
          className="border border-border rounded-lg p-4 hover:bg-muted/20 civic-transition">

            <div className="flex items-start space-x-4">
              {/* Staff Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                src={staff?.avatar}
                alt={staff?.avatarAlt}
                className="w-full h-full object-cover" />

              </div>

              {/* Staff Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {staff?.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {staff?.role} • {staff?.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(staff?.status)}`}>
                      {staff?.status?.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={12} className="text-warning fill-current" />
                      <span className="text-xs text-foreground">{staff?.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Workload Indicator */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Current Workload</span>
                    <span className="text-foreground">
                      {staff?.currentLoad}/{staff?.maxCapacity} tasks
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                    className={`h-2 rounded-full civic-transition ${getUtilizationColor(workloadBalance?.[staff?.id]?.utilization || 0)}`}
                    style={{ width: `${workloadBalance?.[staff?.id]?.utilization || 0}%` }} />

                  </div>
                </div>

                {/* Staff Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Vehicle:</span>
                    <p className="text-foreground font-medium">{staff?.vehicleType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Completed Today:</span>
                    <p className="text-foreground font-medium">{staff?.completedToday}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Specialties:</span>
                    <p className="text-foreground font-medium">{staff?.skills?.join(', ')}</p>
                  </div>
                </div>

                {/* Assignment Controls */}
                {selectedRequests?.length > 0 && staff?.status === 'available' &&
              <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center space-x-3">
                      <Select
                    placeholder="Assign request..."
                    options={selectedRequests?.map((req) => ({
                      value: req?.id,
                      label: `${req?.id} - ${req?.location}`,
                      description: `Priority: ${req?.priority} | Fill: ${req?.fillLevel}%`
                    }))}
                    value={Object.keys(assignments)?.find((reqId) => assignments?.[reqId] === staff?.id) || ''}
                    onChange={(requestId) => handleStaffAssignment(requestId, staff?.id)}
                    className="flex-1" />

                      <Button
                    variant="outline"
                    size="sm"
                    iconName="MapPin"
                    iconSize={14}
                    title="View on map" />

                    </div>
                  </div>
              }

                {/* Current Assignments */}
                {Object.entries(assignments)?.some(([reqId, staffId]) => staffId === staff?.id) &&
              <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center space-x-2 text-xs">
                      <Icon name="CheckCircle" size={12} className="text-success" />
                      <span className="text-success font-medium">
                        Assigned: {Object.entries(assignments)?.filter(([reqId, staffId]) => staffId === staff?.id)?.length} new tasks
                      </span>
                    </div>
                  </div>
              }
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Assignment Summary */}
      {Object.keys(assignments)?.length > 0 &&
      <div className="p-4 border-t border-border bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                Assignment Summary
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {Object.keys(assignments)?.length} assignments pending confirmation
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            {Object.entries(assignments)?.map(([requestId, staffId]) => {
            const staff = availableStaff?.find((s) => s?.id === staffId);
            const request = selectedRequests?.find((r) => r?.id === requestId);
            return (
              <div key={requestId} className="flex items-center justify-between text-xs bg-background rounded p-2">
                  <span className="text-foreground">
                    {request?.id} → {staff?.name}
                  </span>
                  <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  iconSize={12}
                  onClick={() => {
                    const newAssignments = { ...assignments };
                    delete newAssignments?.[requestId];
                    setAssignments(newAssignments);
                  }} />

                </div>);

          })}
          </div>
        </div>
      }
    </div>);

};

export default StaffAssignment;