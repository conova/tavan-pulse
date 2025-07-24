import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Users, FileText, MessageCircle, User } from 'lucide-react';

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Clock, label: 'Цаг', activeColor: 'text-primary' },
    { path: '/team', icon: Users, label: 'Баг', activeColor: 'text-success' },
    { path: '/requests', icon: FileText, label: 'Хүсэлт', activeColor: 'text-warning' },
    { path: '/chat', icon: MessageCircle, label: 'Чат', activeColor: 'text-accent' },
    { path: '/profile', icon: User, label: 'Профайл', activeColor: 'text-primary-glow' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map(({ path, icon: Icon, label, activeColor }) => (
            <Link
              key={path}
              to={path}
              className={`mobile-nav-item ${
                isActive(path) 
                  ? `${activeColor} bg-muted/50` 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive(path) ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;