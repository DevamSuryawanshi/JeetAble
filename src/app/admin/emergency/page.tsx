'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function EmergencyHelp() {
  const router = useRouter();

  return (
    <AdminLayout title="Emergency Help">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Contact Information</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Emergency Contact Name" className="w-full p-3 border rounded" />
            <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded" />
            <input type="email" placeholder="Email Address" className="w-full p-3 border rounded" />
            <button type="submit" className="bg-red-500 text-white px-6 py-3 rounded">Save</button>
          </form>
        </div>
        <button onClick={() => router.push('/admin')} className="bg-gray-500 text-white px-6 py-3 rounded">
          Return to Dashboard
        </button>
      </div>
    </AdminLayout>
  );
}