'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface AdminProfile {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile');
      const data = await response.json();
      
      if (data.success) {
        setAdmin(data.admin);
        setFormData({
          name: data.admin.name,
          phone: data.admin.phone
        });
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      router.push('/admin/login');
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsEditing(false);
        fetchAdminProfile();
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <AdminLayout title="Admin Profile">
      <div className="max-w-4xl mx-auto">
        {!admin ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Loading Profile...</h2>
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
                <label className="block text-sm font-medium mb-2">Full Name</label>
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
                <p className="p-3 bg-gray-50 rounded">{admin.email}</p>
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
                <label className="block text-sm font-medium mb-2">Role</label>
                <p className="p-3 bg-gray-50 rounded">{admin.role}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Joined Date</label>
                <p className="p-3 bg-gray-50 rounded">
                  {new Date(admin.createdAt).toLocaleDateString()}
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