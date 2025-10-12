import { Button } from './ui/button';
import { FileText, History, User, LogOut, Home } from 'lucide-react';

type NavigationPage = 'start' | 'sessions' | 'profile';

interface NavigationProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onLogout: () => void;
  userName?: string;
}

export function Navigation({
  currentPage,
  onNavigate,
  onLogout,
  userName,
}: NavigationProps) {
  const navItems = [
    { id: 'start' as const, label: 'Главная', icon: Home },
    { id: 'sessions' as const, label: 'Мои интервью', icon: History },
    { id: 'profile' as const, label: 'Профиль', icon: User },
  ];

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Neuro Resume
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  onClick={() => onNavigate(item.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}

            {/* User Info & Logout */}
            <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 flex items-center gap-3">
              {userName && (
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline">
                  {userName}
                </span>
              )}
              <Button
                variant="ghost"
                onClick={onLogout}
                className="gap-2 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Выход</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
