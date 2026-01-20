'use client';

import React, { useState, useEffect } from 'react';
import { colors } from '@/constants/colors';
import { departmentService } from '@/services/departmentService';
import { getUser } from '@/services/authService';
import { Button } from '@/components';

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: {
    url?: string;
  };
}

interface JoinRequest {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  requestMessage: string;
  createdAt: string;
}

const ManageMembers: React.FC = () => {
  const colorScheme = colors;
  const user = getUser();

  const [members, setMembers] = useState<Member[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'requests'>('members');
  const [rejectReason, setRejectReason] = useState<{ [key: string]: string }>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.department) {
        setError('Department information not found');
        setLoading(false);
        return;
      }

      // Fetch members
      const membersResponse = await departmentService.getDepartmentMembers(user.department);
      if (membersResponse.success) {
        setMembers(membersResponse.members);
      }

      // Fetch join requests
      const requestsResponse = await departmentService.getDepartmentJoinRequests(user.department);
      if (requestsResponse.success) {
        setJoinRequests(
          requestsResponse.requests.filter((req: any) => req.status === 'pending')
        );
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMember = async (requestId: string) => {
    try {
      setLoading(true);
      const response = await departmentService.respondToJoinRequest(
        user?.department!,
        requestId,
        { status: 'approved' }
      );

      if (response.success) {
        // Refresh data
        await fetchData();
      } else {
        setError(response.message || 'Failed to approve request');
      }
    } catch (err) {
      console.error('Error approving request:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectMember = async (requestId: string) => {
    const reason = rejectReason[requestId] || '';

    try {
      setLoading(true);
      const response = await departmentService.respondToJoinRequest(
        user?.department!,
        requestId,
        { status: 'rejected', rejectionReason: reason }
      );

      if (response.success) {
        setRejectingId(null);
        setRejectReason(prev => {
          const newReason = { ...prev };
          delete newReason[requestId];
          return newReason;
        });
        await fetchData();
      } else {
        setError(response.message || 'Failed to reject request');
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await departmentService.removeMember(user?.department!, memberId);

      if (response.success) {
        setMembers(members.filter(m => m._id !== memberId));
      } else {
        setError(response.message || 'Failed to remove member');
      }
    } catch (err) {
      console.error('Error removing member:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">Manage Members</h1>
        <p style={{ color: colorScheme.textSecondary }} className="mt-2">
          Manage department members and join requests
        </p>
      </div>

      {error && (
        <div
          className="p-4 rounded-lg border-l-4"
          style={{
            backgroundColor: '#f8d7da',
            borderColor: '#dc3545',
            color: '#721c24',
          }}
        >
          ✗ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: colorScheme.border }}>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 font-medium border-b-2 transition-all ${
            activeTab === 'members' ? 'border-current' : 'border-transparent'
          }`}
          style={{
            color: activeTab === 'members' ? colors.primary : colorScheme.textSecondary,
          }}
        >
          Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 font-medium border-b-2 transition-all ${
            activeTab === 'requests' ? 'border-current' : 'border-transparent'
          }`}
          style={{
            color: activeTab === 'requests' ? colors.primary : colorScheme.textSecondary,
          }}
        >
          Join Requests ({joinRequests.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p>Loading...</p>
        </div>
      ) : activeTab === 'members' ? (
        // Members List
        <div className="space-y-4">
          {members.length === 0 ? (
            <div
              className="p-8 rounded-lg text-center"
              style={{ backgroundColor: colorScheme.surface }}
            >
              <p style={{ color: colorScheme.textSecondary }}>No members yet</p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member._id}
                className="p-4 rounded-lg shadow-md flex justify-between items-start md:items-center"
                style={{ backgroundColor: colorScheme.surface }}
              >
                <div className="flex-1">
                  <h3 className="font-bold">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p style={{ color: colorScheme.textSecondary }} className="text-sm">
                    {member.email}
                  </p>
                </div>
                <Button
                  onClick={() => handleRemoveMember(member._id)}
                  variant="secondary"
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      ) : (
        // Join Requests
        <div className="space-y-4">
          {joinRequests.length === 0 ? (
            <div
              className="p-8 rounded-lg text-center"
              style={{ backgroundColor: colorScheme.surface }}
            >
              <p style={{ color: colorScheme.textSecondary }}>No pending join requests</p>
            </div>
          ) : (
            joinRequests.map((request) => (
              <div
                key={request._id}
                className="p-6 rounded-lg shadow-md border-l-4"
                style={{
                  backgroundColor: colorScheme.surface,
                  borderColor: colors.primary,
                }}
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold">
                      {request.userId.firstName} {request.userId.lastName}
                    </h3>
                    <p style={{ color: colorScheme.textSecondary }} className="text-sm">
                      {request.userId.email}
                    </p>
                  </div>

                  {request.requestMessage && (
                    <div
                      className="p-3 rounded bg-opacity-20"
                      style={{
                        backgroundColor: colorScheme.border,
                      }}
                    >
                      <p className="text-sm">
                        <strong>Message:</strong> {request.requestMessage}
                      </p>
                    </div>
                  )}

                  <p style={{ color: colorScheme.textSecondary }} className="text-xs">
                    Requested on:{' '}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>

                  {rejectingId === request._id ? (
                    <div className="space-y-2 pt-2">
                      <textarea
                        value={rejectReason[request._id] || ''}
                        onChange={(e) =>
                          setRejectReason(prev => ({
                            ...prev,
                            [request._id]: e.target.value,
                          }))
                        }
                        placeholder="Reason for rejection (optional)"
                        rows={2}
                        className="w-full px-3 py-2 rounded text-sm border"
                        style={{
                          borderColor: colorScheme.border,
                          backgroundColor: colorScheme.background,
                          color: colorScheme.text,
                        }}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRejectMember(request._id)}
                          variant="secondary"
                          disabled={loading}
                          className="flex-1"
                        >
                          Confirm Rejection
                        </Button>
                        <Button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectReason(prev => {
                              const newReason = { ...prev };
                              delete newReason[request._id];
                              return newReason;
                            });
                          }}
                          variant="primary"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleApproveMember(request._id)}
                        variant="primary"
                        disabled={loading}
                        className="flex-1"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => setRejectingId(request._id)}
                        variant="secondary"
                        disabled={loading}
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
