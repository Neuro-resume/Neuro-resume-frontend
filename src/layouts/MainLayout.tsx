import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/contexts/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

export function MainLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentPage = (): 'start' | 'sessions' | 'profile' => {
    if (location.pathname.startsWith('/sessions')) return 'sessions';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return 'start';
  };

  const handleNavigate = (page: 'start' | 'sessions' | 'profile') => {
    const routes = {
      start: '/',
      sessions: '/sessions',
      profile: '/profile',
    };
    navigate(routes[page]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        currentPage={getCurrentPage()}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={user?.username}
      />
      <Outlet />
    </div>
  );
}
