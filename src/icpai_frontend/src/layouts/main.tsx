import React from 'react';
import { Navbar } from '@/components/main/navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {

  return (
    <div>
      <nav>
        <Navbar />
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
