'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { departmentService } from '@/services/departmentService';
import { useAuthContext } from '@/contexts/AuthContext';

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: {
    url: string;
  };
}

interface JoinRequest {
  _id: string;
  userId: Member;
  status: 'pending' | 'approved' | 'rejected';
  requestMessage?: string;
  rejectionReason?: string;
  createdAt: string;
}

const ManageMembers: React.FC = () => {
  const colorScheme = colors;
  const { user } = useAuthContext();
  const [members, setMembers] = useState<Member[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'requests'>('members');
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.department) {
      fetchMembersAndRequests();
    }
  }, [user]);

  const fetchMembersAndRequests = async () => {
    try {
      setLoading(true);

      // Fetch department members
      const membersResponse = await departmentService.getDepartmentMembers(user?.department!);
      setMembers(membersResponse.members || []);

      // Fetch join requests
      const requestsResponse = await departmentService.getDepartmentJoinRequests(user?.department!);
      setJoinRequests(requestsResponse.requests || []);
    } catch (error) {
      console.error('Failed to fetch members and requests:', error);
      alert('Failed to load members and requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMember = async (requestId: string) => {
    try {
      setActionLoading(true);
      await departmentService.respondToJoinRequest(user?.department!, requestId, {
        status: 'approved',
      });
      alert('Request approved successfully!');
      await fetchMembersAndRequests();
      setSelectedRequestId(null);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectMember = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      await departmentService.respondToJoinRequest(user?.department!, requestId, {
        status: 'rejected',
        rejectionReason,
      });
      alert('Request rejected successfully!');
      await fetchMembersAndRequests();
      setSelectedRequestId(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the department?`)) {
      try {
        await departmentService.removeMemberFromDepartment(user?.department!, memberId);
        alert('Member removed successfully');
        await fetchMembersAndRequests();
      } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'Failed to remove member');
      }
    }
  };

  const pendingRequests = joinRequests.filter(req => req.status === 'pending');

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Members</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-300 rounded-lg" />
          <div className="h-64 bg-gray-300 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Members</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: colorScheme.border }}>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-3 font-semibold border-b-2 transition-all ${
            activeTab === 'members'
              ? 'border-current'
              : 'border-transparent'
          }`}
          style={{
            color: activeTab === 'members' ? colors.primary : colorScheme.textSecondary,
          }}
        >
          Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-3 font-semibold border-b-2 transition-all ${
            activeTab === 'requests'
              ? 'border-current'
              : 'border-transparent'
          }`}
          style={{
            color: activeTab === 'requests' ? colors.primary : colorScheme.textSecondary,
          }}
        >
          Join Requests ({pendingRequests.length})
        </button>
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.length > 0 ? (
            members.map((member) => (
              <div
                key={member._id}
                className="rounded-lg p-4 shadow-md"
                style={{ backgroundColor: colorScheme.surface }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      {member.email}
                    </p>
                  </div>
                  {member.profilePicture?.url && (
                    <img
                      src={member.profilePicture.url}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </div>

                <button
                  onClick={() =>
                    handleRemoveMember(
                      member._id,
                      `${member.firstName} ${member.lastName}`
                    )
                  }
                  className="w-full px-3 py-2 mt-3 text-sm text-red-600 rounded transition-all"
                  style={{ backgroundColor: '#ff666620' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff666630';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff666620';
                  }}
                >
                  Remove Member
                </button>
              </div>
            ))
          ) : (
            <div
              className="col-span-full py-12 text-center"
              style={{ color: colorScheme.textSecondary }}
            >
              <p className="text-lg">No members in your department yet</p>
            </div>
          )}
        </div>
      )}

      {/* Join Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div
                key={request._id}
                className="rounded-lg p-4 shadow-md"
                style={{ backgroundColor: colorScheme.surface }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {request.userId.firstName} {request.userId.lastName}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      {request.userId.email}
                    </p>
                    {request.requestMessage && (
                      <p className="text-sm mt-2 italic">{request.requestMessage}</p>
                    )}
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: '#ffc10730',
                      color: '#ffc107',
                    }}
                  >
                    Pending
                  </span>
                </div>

                {selectedRequestId === request._id ? (
                  <div className="space-y-3 mt-4 p-3 rounded" style={{ backgroundColor: colorScheme.background }}>
                    <textarea
                      placeholder="Rejection reason (if rejecting)..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                      style={{
                        borderColor: colorScheme.border,
                        backgroundColor: colorScheme.surface,
                      }}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveMember(request._id)}
                        disabled={actionLoading}
                        className="flex-1 text-sm"
                        style={{
                          backgroundColor: '#4caf50',
                          color: '#ffffff',
                          opacity: actionLoading ? 0.6 : 1,
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectMember(request._id)}
                        disabled={actionLoading}
                        className="flex-1 text-sm"
                        style={{
                          backgroundColor: '#f44336',
                          color: '#ffffff',
                          opacity: actionLoading ? 0.6 : 1,
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedRequestId(null);
                          setRejectionReason('');
                        }}
                        className="flex-1 text-sm"
                        style={{
                          backgroundColor: colorScheme.border,
                          color: colorScheme.text,
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => setSelectedRequestId(request._id)}
                      className="flex-1 text-sm"
                      style={{
                        backgroundColor: `${colors.primary}20`,
                        color: colors.primary,
                      }}
                    >
                      Review
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              className="py-12 text-center"
              style={{ color: colorScheme.textSecondary }}
            >
              <p className="text-lg">No pending join requests</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
