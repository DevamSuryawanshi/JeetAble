'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface AdminProfile {
  _id?: string;
  adminId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: string;
  permissions: string[];
  lastLogin: string;
}

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: ''
  });

  useEffect(() => {
    fetchAdminProfile('admin001');
  }, []);

  const fetchAdminProfile = async (adminId: string) => {
    try {
      const response = await fetch(`/api/admin/profile?adminId=${adminId}`);
      const data = await response.json();
      
      if (data.success) {
        setAdmin(data.admin);
        setFormData({
          name: data.admin.name,
          email: data.admin.email,
          phone: data.admin.phone,
          department: data.admin.department,
          role: data.admin.role
        });
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'admin001',
          ...formData
        })
      });

      if (response.ok) {
        setIsEditing(false);
        fetchAdminProfile('admin001');
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const createAdminProfile = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'admin001',
          name: 'Admin User',
          email: 'admin@jeetable.com',
          phone: '+91 9876543210',
          department: 'IT Administration',
          role: 'Super Admin'
        })
      });

      const data = await response.json();
      if (data.success) {
        setAdmin(data.admin);
        setFormData({
          name: data.admin.name,
          email: data.admin.email,
          phone: data.admin.phone,
          department: data.admin.department,
          role: data.admin.role
        });
      }
    } catch (error) {
      console.error('Error creating admin profile:', error);
    }
  };

  return (
    <AdminLayout title="Admin Profile">
      <div className="max-w-4xl mx-auto">
        {!admin ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No Admin Profile Found</h2>
            <button
              onClick={createAdminProfile}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Create Admin Profile
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Admin Profile</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border rounded"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded">{admin.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border rounded"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded">{admin.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border rounded"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded">{admin.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full p-3 border rounded"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded">{admin.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                {isEditing ? (
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full p-3 border rounded"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                ) : (
                  <p className="p-3 bg-gray-50 rounded">{admin.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Join Date</label>
                <p className="p-3 bg-gray-50 rounded">
                  {admin.joinDate ? new Date(admin.joinDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            )}


          </div>
        )}
      </div>
    </AdminLayout>
  );
}