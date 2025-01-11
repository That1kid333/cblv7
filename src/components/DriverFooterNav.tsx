import { LayoutDashboard, Car, CalendarRange, MessageCircle, Settings, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DriverFooterNavProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  tabs: string[];
}

interface NavItem {
  name: string;
  icon: LucideIcon;
}

export function DriverFooterNav({ activeTab, onTabChange, tabs }: DriverFooterNavProps) {
  const getIcon = (name: string): LucideIcon => {
    switch (name.toLowerCase()) {
      case 'overview':
        return LayoutDashboard;
      case 'rides':
        return Car;
      case 'schedule':
        return CalendarRange;
      case 'messages':
        return MessageCircle;
      case 'settings':
        return Settings;
      default:
        return LayoutDashboard;
    }
  };

  const navItems: NavItem[] = tabs.map(name => ({
    name,
    icon: getIcon(name)
  }));

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 md:relative md:border-none md:bg-transparent md:mb-6">
      <div className="flex justify-around md:justify-start md:space-x-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => onTabChange(index)}
              className={`flex flex-col items-center py-3 px-4 md:flex-row md:py-2 md:px-4 md:rounded-lg transition-colors ${
                activeTab === index
                  ? 'text-[#C69249] md:bg-[#C69249] md:text-white'
                  : 'text-neutral-400 hover:text-neutral-200 md:hover:bg-neutral-800'
              }`}
            >
              <Icon size={24} className="mb-1 md:mb-0 md:mr-2" />
              <span className="text-xs md:text-sm font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
