import React from 'react';
import { Clock, CalendarRange, MessageCircle, Settings } from 'lucide-react';

interface FooterNavProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

interface NavItem {
  name: string;
  icon: React.ComponentType;
}

export function FooterNav({ activeTab, onTabChange }: FooterNavProps) {
  const navItems: NavItem[] = [
    { name: 'History', icon: Clock },
    { name: 'Schedule', icon: CalendarRange },
    { name: 'Messages', icon: MessageCircle },
    { name: 'Settings', icon: Settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => onTabChange(index)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                activeTab === index
                  ? 'text-[#C69249]'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
