'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/admin/emergency')}
            className="bg-red-500 text-white p-6 rounded-lg hover:bg-red-600 text-center"
          >
            <div className="text-3xl mb-2">🚨</div>
            <h3 className="text-lg font-bold">Emergency Help</h3>
          </button>
          
          <button
            onClick={() => router.push('/admin/learning')}
            className="bg-blue-500 text-white p-6 rounded-lg hover:bg-blue-600 text-center"
          >
            <div className="text-3xl mb-2">📚</div>
            <h3 className="text-lg font-bold">Learning Hub</h3>
          </button>
          
          <button
            onClick={() => router.push('/admin/schemes')}
            className="bg-green-500 text-white p-6 rounded-lg hover:bg-green-600 text-center"
          >
            <div className="text-3xl mb-2">🏛️</div>
            <h3 className="text-lg font-bold">Government Schemes</h3>
          </button>
          
          <button
            onClick={() => router.push('/admin/jobs')}
            className="bg-purple-500 text-white p-6 rounded-lg hover:bg-purple-600 text-center"
          >
            <div className="text-3xl mb-2">💼</div>
            <h3 className="text-lg font-bold">Job Portal</h3>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}