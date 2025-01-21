import React from 'react';
import { Switch } from '@headlessui/react';

interface OnlineToggleProps {
  isOnline: boolean;
  onChange: (online: boolean) => void;
}

export const OnlineToggle: React.FC<OnlineToggleProps> = ({ isOnline, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isOnline}
        onChange={onChange}
        className={`${
          isOnline ? 'bg-[#C69249]' : 'bg-neutral-700'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
      >
        <span
          className={`${
            isOnline ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      <span className="text-sm font-medium">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};
