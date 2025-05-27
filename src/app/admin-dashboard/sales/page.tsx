'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin-dashboard" className="text-white/60 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Sales Overview</h1>
      </div>
      
      {/* Detailed sales content will go here */}
      <div className="bento-card p-6">
        <p className="text-white/60">Detailed sales analytics and reports coming soon...</p>
      </div>
    </div>
  );
} 