import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Heart, Mail, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
        
        <footer className="border-t border-gray-300 bg-gradient-to-r from-card via-card to-muted/30">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Brand & Copyright */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-blue-500 font-bold text-sm">M</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">MiniManager</span>
                  <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} All rights reserved</span>
                </div>
              </div>
              
              
              
              
              {/* Built By */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span>Built with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                <span>by</span>
                <span className="font-semibold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Marizu Inc.
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
