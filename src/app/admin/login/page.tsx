'use client';

import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm w-full mx-4">
        <div className="mb-6">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}