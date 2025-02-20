import React from 'react';
import Sidebar from '../components/dashboard/sidebar';
import { DashboardNavbar } from '@/components/dashboard/navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div style={{ display: 'flex' }}>
      <aside className='lg:w-64'>
        <Sidebar />
      </aside>
      <div className='w-full'>
        <DashboardNavbar />
        <section style={{ flex: 1, padding: '20px' }}>
          {children}
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
