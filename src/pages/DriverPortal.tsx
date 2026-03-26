import React, { useState, useEffect } from 'react';
import { DriverFooterNav } from '../components/DriverFooterNav';
import { Overview } from '../components/dashboard/Overview';
import { RidesManagement } from '../components/dashboard/RidesManagement';
import { ScheduleManager } from '../components/dashboard/ScheduleManager';
import { DriverMessagesList } from './DriverMessagesList';
import { Settings } from '../components/dashboard/Settings';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Driver } from '../types/driver';
import { authService } from '../lib/services/auth.service';
import { OnlineToggle } from '../components/dashboard/OnlineToggle';
import { useNavigate } from 'react-router-dom';

interface TabItem {
  name: string;
  component: React.ComponentType<any>;
}

function DriverPortal() {
  const [activeTab, setActiveTab] = useState(0);
  const [driver, setDriver] = useState<Driver | null | undefined>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const setupDriverListener = async () => {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigate('/driver/login');
        return;
      }

      // Set up realtime listener for driver data
      unsubscribeSnapshot = onSnapshot(doc(db, 'drivers', user.uid), (doc) => {
        if (doc.exists()) {
          setDriver({ id: doc.id, ...doc.data() } as Driver);
        } else {
          navigate('/driver/login');
        }
      });
    };

    setupDriverListener();

    return () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [navigate]);

  const handleDriverUpdate = async (updates: Partial<Driver>) => {
    if (!driver) return;
    try {
      await updateDoc(doc(db, 'drivers', driver.id), updates);
    } catch (error) {
      console.error('Error updating driver:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      navigate('/driver/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const tabNames = ['Overview', 'Rides', 'Schedule', 'Messages', 'Settings'];
  const tabs: TabItem[] = [
    { name: tabNames[0], component: Overview },
    { name: tabNames[1], component: RidesManagement },
    { name: tabNames[2], component: ScheduleManager },
    { name: tabNames[3], component: DriverMessagesList },
    { name: tabNames[4], component: Settings }
  ];

  if (!driver) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <img 
            src="https://aiautomationsstorage.blob.core.windows.net/cbl/citybucketlist%20logo.png" 
            alt="City Bucket List" 
            className="h-12 object-contain"
          />
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Online Toggle */}
        <div className="mb-8">
          <OnlineToggle
            driver={driver}
            onUpdate={(updates) => {
              setDriver(prev => prev ? { ...prev, ...updates } : null);
            }}
          />
        </div>
        
        {/* Tabs Content */}
        <div className="space-y-8">
          {tabs.map((tab, index) => (
            <div
              key={tab.name}
              className={activeTab === index ? '' : 'hidden'}
            >
              <tab.component driver={driver} onUpdate={handleDriverUpdate} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <DriverFooterNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs.map(t => t.name)}
      />
    </div>
  );
}

export default DriverPortal;