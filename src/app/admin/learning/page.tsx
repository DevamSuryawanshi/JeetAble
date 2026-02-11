'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function LearningHub() {
  const router = useRouter();

  return (
    <AdminLayout title="Learning Hub">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded mb-6">
          <h2 className="text-xl font-semibold mb-4">Add / Remove Study Material</h2>
          <form className="space-y-4 mb-6">
            <input type="text" placeholder="Material Title" className="w-full p-3 border rounded" />
            <textarea placeholder="Description" className="w-full p-3 border rounded h-24" />
            <input type="file" className="w-full p-3 border rounded" />
            <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded">Add Material</button>
          </form>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Sample Study Material 1</span>
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