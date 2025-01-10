import React from 'react';
import { Bell, MessageSquare, DollarSign, Car } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export function NotificationSettings() {
  const [settings, setSettings] = React.useState<NotificationSetting[]>([
    {
      id: 'new-rides',
      title: 'New Ride Requests',
      description: 'When you receive new ride requests',
      email: true,
      push: true,
      sms: true
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'When you receive new messages from customers',
      email: true,
      push: true,
      sms: false
    },
    {
      id: 'earnings',
      title: 'Earnings',
      description: 'Weekly earnings reports and deposits',
      email: true,
      push: false,
      sms: false
    },
    {
      id: 'updates',
      title: 'App Updates',
      description: 'Important updates and announcements',
      email: true,
      push: true,
      sms: false
    }
  ]);

  const toggleSetting = (id: string, type: 'email' | 'push' | 'sms') => {
    setSettings(prev => prev.map(setting => {
      if (setting.id === id) {
        return { ...setting, [type]: !setting[type] };
      }
      return setting;
    }));
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'new-rides':
        return Car;
      case 'messages':
        return MessageSquare;
      case 'earnings':
        return DollarSign;
      default:
        return Bell;
    }
  };

  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>

      <div className="space-y-6">
        {settings.map(setting => {
          const Icon = getIcon(setting.id);
          return (
            <div key={setting.id} className="bg-neutral-800 p-4 rounded-lg">
              <div className="flex items-start gap-3 mb-4">
                <Icon className="w-5 h-5 text-[#F5A623]" />
                <div>
                  <h3 className="font-medium">{setting.title}</h3>
                  <p className="text-sm text-neutral-400">{setting.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => toggleSetting(setting.id, 'email')}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    setting.email
                      ? 'bg-[#F5A623] text-white'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  Email
                </button>
                <button
                  onClick={() => toggleSetting(setting.id, 'push')}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    setting.push
                      ? 'bg-[#F5A623] text-white'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  Push
                </button>
                <button
                  onClick={() => toggleSetting(setting.id, 'sms')}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    setting.sms
                      ? 'bg-[#F5A623] text-white'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  SMS
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}