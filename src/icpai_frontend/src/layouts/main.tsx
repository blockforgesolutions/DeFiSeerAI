import React from 'react';
import { Navbar } from '@/components/main/navbar';
import { Footer } from '@/components/main/footer';

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
      <Footer />
    </div>
  );
};

export default MainLayout;
