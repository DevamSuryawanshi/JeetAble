'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Job } from '@/models/Job';

export default function JobPortal() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    jobDescription: '',
    salaryRange: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs-portal');
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/jobs-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.jobTitle,
          company: formData.companyName,
          location: formData.location,
          description: formData.jobDescription,
          salaryRange: formData.salaryRange
        })
      });
      
      if (response.ok) {
        setFormData({ jobTitle: '', companyName: '', location: '', jobDescription: '', salaryRange: '' });
        fetchJobs();
        alert('Job added successfully!');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Failed to add job');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`/api/jobs-portal?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchJobs();
          alert('Job deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  return (
    <AdminLayout title="Job Portal">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded mb-6">
          <h2 className="text-xl font-semibold mb-4">Add / Remove Available Jobs</h2>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <input 
              type="text" 
              placeholder="Job Title" 
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              className="w-full p-3 border rounded" 
              required 
            />
            <input 
              type="text" 
              placeholder="Company Name" 
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full p-3 border rounded" 
              required 
            />
            <input 
              type="text" 
              placeholder="Location" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-3 border rounded" 
              required 
            />
            <textarea 
              placeholder="Job Description" 
              value={formData.jobDescription}
              onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
              className="w-full p-3 border rounded h-24" 
              required 
            />
            <input 
              type="text" 
              placeholder="Salary Range" 
              value={formData.salaryRange}
              onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
              className="w-full p-3 border rounded" 
              required 
            />
            <button type="submit" className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600">
              Add Job
            </button>
          </form>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-3">Available Jobs ({jobs.length})</h3>
            {jobs.map((job) => (
              <div key={job._id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <span className="font-medium">{job.title} - {job.company}</span>
                  <p className="text-sm text-gray-600">{job.location} | {job.salaryRange}</p>
                </div>
                <button 
                  onClick={() => handleDelete(job._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            {jobs.length === 0 && (
              <p className="text-gray-500 text-center py-4">No jobs added yet</p>
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