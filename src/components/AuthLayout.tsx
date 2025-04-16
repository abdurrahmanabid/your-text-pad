// components/AuthLayout.tsx
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-base-100 rounded-box shadow-xl overflow-hidden">

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}