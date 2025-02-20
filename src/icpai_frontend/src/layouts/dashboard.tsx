import React, { useEffect } from 'react';
import Sidebar from '../components/dashboard/sidebar';
import { DashboardNavbar } from '@/components/dashboard/navbar';
import { icpai_backend } from '../../../declarations/icpai_backend';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {

  useEffect(() => {
    const fetchAndTrain = async () => {
      await icpai_backend.fetchAndTrain();
    };

    fetchAndTrain();
  }, [])


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
