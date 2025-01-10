import React from 'react';
import { Lock, Shield, Smartphone } from 'lucide-react';

export function SecuritySettings() {
  const [showPasswordForm, setShowPasswordForm] = React.useState(false);
  const [password, setPassword] = React.useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic
    setShowPasswordForm(false);
    setPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

      {showPasswordForm ? (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Current Password</label>
            <input
              type="password"
              value={password.current}
              onChange={(e) => setPassword(prev => ({ ...prev, current: e.target.value }))}
              className="w-full bg-neutral-800 px-3 py-2 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">New Password</label>
            <input
              type="password"
              value={password.new}
              onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
              className="w-full bg-neutral-800 px-3 py-2 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Confirm New Password</label>
            <input
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
              className="w-full bg-neutral-800 px-3 py-2 rounded-lg"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowPasswordForm(false)}
              className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => setShowPasswordForm(true)}
            className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#F5A623]" />
              <div className="text-left">
                <div className="font-medium">Change Password</div>
                <div className="text-sm text-neutral-400">
                  Update your account password
                </div>
              </div>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#F5A623]" />
              <div className="text-left">
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-neutral-400">
                  Add an extra layer of security
                </div>
              </div>
            </div>
            <span className="text-sm bg-neutral-700 px-2 py-1 rounded">Coming Soon</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#F5A623]" />
              <div className="text-left">
                <div className="font-medium">Security Log</div>
                <div className="text-sm text-neutral-400">
                  View recent account activity
                </div>
              </div>
            </div>
            <span className="text-sm bg-neutral-700 px-2 py-1 rounded">Coming Soon</span>
          </button>
        </div>
      )}
    </div>
  );
}