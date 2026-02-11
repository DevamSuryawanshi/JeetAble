'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { GovernmentScheme } from '@/models/GovernmentScheme';

export default function GovernmentSchemes() {
  const router = useRouter();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [formData, setFormData] = useState({
    schemeName: '',
    schemeDescription: '',
    eligibilityCriteria: '',
    applicationLink: ''
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await fetch('/api/government-schemes');
      const data = await response.json();
      if (data.success) {
        setSchemes(data.data);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/government-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeName: formData.schemeName,
          description: formData.schemeDescription,
          eligibility: formData.eligibilityCriteria,
          applicationLink: formData.applicationLink
        })
      });
      
      if (response.ok) {
        setFormData({ schemeName: '', schemeDescription: '', eligibilityCriteria: '', applicationLink: '' });
        fetchSchemes();
        alert('Scheme added successfully!');
      }
    } catch (error) {
      console.error('Error adding scheme:', error);
      alert('Failed to add scheme');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this scheme?')) {
      try {
        const response = await fetch(`/api/government-schemes?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchSchemes();
          alert('Scheme deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting scheme:', error);
        alert('Failed to delete scheme');
      }
    }
  };

  return (
    <AdminLayout title="Government Schemes">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded mb-6">
          <h2 className="text-xl font-semibold mb-4">Add / Remove Schemes</h2>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <input 
              type="text" 
              placeholder="Scheme Name" 
              value={formData.schemeName}
              onChange={(e) => setFormData({...formData, schemeName: e.target.value})}
              className="w-full p-3 border rounded" 
              required 
            />
            <textarea 
              placeholder="Scheme Description" 
              value={formData.schemeDescription}
              onChange={(e) => setFormData({...formData, schemeDescription: e.target.value})}
              className="w-full p-3 border rounded h-24" 
              required 
            />
            <input 
              type="text" 
              placeholder="Eligibility Criteria" 
              value={formData.eligibilityCriteria}
              onChange={(e) => setFormData({...formData, eligibilityCriteria: e.target.value})}
              className="w-full p-3 border rounded" 
              required 
            />
            <input 
              type="url" 
              placeholder="Application Link" 
              value={formData.applicationLink}
              onChange={(e) => setFormData({...formData, applicationLink: e.target.value})}
              className="w-full p-3 border rounded" 
              required 
            />
            <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
              Add Scheme
            </button>
          </form>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-3">Existing Schemes ({schemes.length})</h3>
            {schemes.map((scheme) => (
              <div key={scheme._id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <span className="font-medium">{scheme.schemeName}</span>
                  <p className="text-sm text-gray-600">{scheme.description?.substring(0, 100) || 'No description'}...</p>
                </div>
                <button 
                  onClick={() => handleDelete(scheme._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            {schemes.length === 0 && (
              <p className="text-gray-500 text-center py-4">No schemes added yet</p>
            )}
          </div>
        </div>
        <button onClick={() => router.push('/admin')} className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600">
          Return to Dashboard
        </button>
      </div>
    </AdminLayout>
  );
}