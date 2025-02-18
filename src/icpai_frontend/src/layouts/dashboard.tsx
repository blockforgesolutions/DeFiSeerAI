import React from 'react';
import Sidebar from '../components/dashboard/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div style={{ display: 'flex' }}>
      <aside className='lg:w-64'>
        <Sidebar />
      </aside>
      <section style={{ flex: 1, padding: '20px' }}>
        {children}
      </section>
    </div>
  );
};

export default DashboardLayout;
