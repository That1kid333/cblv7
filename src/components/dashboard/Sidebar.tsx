import { 
  LayoutDashboard, Car, Calendar, 
  MessageCircle, Settings 
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'rides', label: 'Rides', icon: Car },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-neutral-900 text-white">
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex items-center p-2 rounded-lg hover:bg-neutral-800 transition-colors ${currentView === item.id ? 'bg-neutral-800' : ''}`}
          >
            <item.icon className="w-5 h-5 mr-2" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export function BottomNav({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'rides', label: 'Rides', icon: Car },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 text-white flex justify-around">
      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`flex flex-col items-center p-2 ${currentView === item.id ? 'text-[#C69249]' : ''}`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
    </div>
  );
}