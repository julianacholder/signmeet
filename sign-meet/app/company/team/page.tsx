'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Trash2, 
  Edit, 
  Calendar,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  interviews: number;
  lastActive: string;
  joinedDate: string;
  status: 'active' | 'inactive';
}

export default function TeamPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Bryan Johnson',
      email: 'bryan.johnson@techcorp.com',
      role: 'UI Manager',
      avatar: 'BJ',
      interviews: 45,
      lastActive: '2 hours ago',
      joinedDate: 'Jan 2024',
      status: 'active'
    },
    {
      id: '2',
      name: 'Daniel Prince',
      email: 'daniel.prince@techcorp.com',
      role: 'Tech Lead',
      avatar: 'DP',
      interviews: 78,
      lastActive: '3 hours ago',
      joinedDate: 'Dec 2023',
      status: 'active'
    },
    {
      id: '3',
      name: 'Sarah Ryan',
      email: 'sarah.ryan@techcorp.com',
      role: 'HR Manager',
      avatar: 'SR',
      interviews: 62,
      lastActive: '1 hour ago',
      joinedDate: 'Feb 2024',
      status: 'active'
    },
    {
      id: '4',
      name: 'Michael Chen',
      email: 'michael.chen@techcorp.com',
      role: 'Product Manager',
      avatar: 'MC',
      interviews: 34,
      lastActive: '5 hours ago',
      joinedDate: 'Mar 2024',
      status: 'active'
    },
    {
      id: '5',
      name: 'Emma Williams',
      email: 'emma.williams@techcorp.com',
      role: 'Recruiter',
      avatar: 'EW',
      interviews: 91,
      lastActive: '30 minutes ago',
      joinedDate: 'Jan 2024',
      status: 'active'
    },
    {
      id: '6',
      name: 'James Anderson',
      email: 'james.anderson@techcorp.com',
      role: 'Engineering Manager',
      avatar: 'JA',
      interviews: 56,
      lastActive: '4 hours ago',
      joinedDate: 'Nov 2023',
      status: 'active'
    }
  ]);

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: '',
    name: ''
  });

  const handleInviteMember = () => {
    if (inviteForm.email && inviteForm.role && inviteForm.name) {
      // In real app, this would call an API
      console.log('Inviting member:', inviteForm);
      setIsInviteOpen(false);
      setInviteForm({ email: '', role: '', name: '' });
      alert('Invitation sent successfully!');
    }
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
      alert('Team member removed successfully!');
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalInterviews = teamMembers.reduce((sum, member) => sum + member.interviews, 0);
  const activeMembers = teamMembers.filter(m => m.status === 'active').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
            
          </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new team member to join your workspace
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={inviteForm.role}
                    onValueChange={(value) => setInviteForm({ ...inviteForm, role: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR Manager">HR Manager</SelectItem>
                      <SelectItem value="Recruiter">Recruiter</SelectItem>
                      <SelectItem value="Tech Lead">Tech Lead</SelectItem>
                      <SelectItem value="Engineering Manager">Engineering Manager</SelectItem>
                      <SelectItem value="Product Manager">Product Manager</SelectItem>
                      <SelectItem value="UI Manager">UI Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsInviteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleInviteMember}
                  >
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

     
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Team Members ({filteredMembers.length})</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="HR Manager">HR Manager</SelectItem>
                <SelectItem value="Recruiter">Recruiter</SelectItem>
                <SelectItem value="Tech Lead">Tech Lead</SelectItem>
                <SelectItem value="Engineering Manager">Engineering Manager</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="UI Manager">UI Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm font-medium text-primary">{member.role}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{member.interviews}</p>
                    <p className="text-xs text-gray-500">Interviews</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {member.lastActive}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Joined {member.joinedDate}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No team members found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}