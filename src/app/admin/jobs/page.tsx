'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function JobPortal() {
  const router = useRouter();

  return (
    <AdminLayout title="Job Portal">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded mb-6">
          <h2 className="text-xl font-semibold mb-4">Add / Remove Available Jobs</h2>
          <form className="space-y-4 mb-6">
            <input type="text" placeholder="Job Title" className="w-full p-3 border rounded" />
            <input type="text" placeholder="Company Name" className="w-full p-3 border rounded" />
            <input type="text" placeholder="Location" className="w-full p-3 border rounded" />
            <textarea placeholder="Job Description" className="w-full p-3 border rounded h-24" />
            <input type="text" placeholder="Salary Range" className="w-full p-3 border rounded" />
            <button type="submit" className="bg-purple-500 text-white px-6 py-3 rounded">Add Job</button>
          </form>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Software Developer - ABC Corp</span>
              <button className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
            </div>
          </div>
        </div>
        <button onClick={() => router.push('/admin')} className="bg-gray-500 text-white px-6 py-3 rounded">
          Return to Dashboard
        </button>
      </div>
    </AdminLayout>
  );
}