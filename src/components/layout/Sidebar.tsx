import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  FileText,
  Users,
  Settings,
  X,
  Bike
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/',
      icon: LayoutDashboard,
      roles: ['admin', 'mecanicien', 'receptionniste']
    },
    {
      name: 'Checklist d\'entrée',
      href: '/checklist',
      icon: ClipboardList,
      roles: ['admin', 'receptionniste']
    },
    {
      name: 'Réparations',
      href: '/reparations',
      icon: Wrench,
      roles: ['admin', 'mecanicien']
    },
    {
      name: 'Contrats',
      href: '/contrats',
      icon: FileText,
      roles: ['admin', 'receptionniste']
    },
    {
      name: 'Utilisateurs',
      href: '/utilisateurs',
      icon: Users,
      roles: ['admin']
    },
    {
      name: 'Administration',
      href: '/administration',
      icon: Settings,
      roles: ['admin']
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Atelier Moto</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.nom.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.nom}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
              }}
              className="ml-4 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
