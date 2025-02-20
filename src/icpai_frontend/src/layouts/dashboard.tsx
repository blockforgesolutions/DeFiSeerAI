import React, { useEffect } from 'react';
import Sidebar from '../components/dashboard/sidebar';
import { DashboardNavbar } from '@/components/dashboard/navbar';
import { icpai_backend } from '../../../declarations/icpai_backend';
import { useLoading } from '@/context/loading-context';
import GlobalLoading from '@/components/ui/loading';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchAndTrain = async () => {
      setLoading(true);
      await icpai_backend.fetchAndTrain();
      setLoading(false);
    };

    fetchAndTrain();
  }, [])


  return (
    <div style={{ display: 'flex' }}>
      <GlobalLoading />
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
