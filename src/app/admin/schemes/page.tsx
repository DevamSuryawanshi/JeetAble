'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function GovernmentSchemes() {
  const router = useRouter();

  return (
    <AdminLayout title="Government Schemes">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded mb-6">
          <h2 className="text-xl font-semibold mb-4">Add / Remove Schemes</h2>
          <form className="space-y-4 mb-6">
            <input type="text" placeholder="Scheme Name" className="w-full p-3 border rounded" />
            <textarea placeholder="Scheme Description" className="w-full p-3 border rounded h-24" />
            <input type="text" placeholder="Eligibility Criteria" className="w-full p-3 border rounded" />
            <input type="url" placeholder="Application Link" className="w-full p-3 border rounded" />
            <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded">Add Scheme</button>
          </form>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Disability Pension Scheme</span>
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