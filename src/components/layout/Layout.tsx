import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Notification } from '@/components/ui/Notification';

export function Layout() {
  return (
    <div className="min-h-screen bg-mana-cream">
      <Navbar />
      
      <main className="min-h-screen pb-20 lg:pb-0">
        <Outlet />
      </main>
      
      <MobileNav />
      <Notification />
    </div>
  );
}
