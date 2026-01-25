import React from 'react'
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <Outlet />;
};
const Adminlayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
              <ScrollToTop/>
            </main>
        </div>
    </div>  
  )
}

export default Adminlayout