import React, { useState, useEffect } from 'react';
import { DriverFooterNav } from '../components/DriverFooterNav';
import { Overview } from '../components/dashboard/Overview';
import { RidesManagement } from '../components/dashboard/RidesManagement';
import { ScheduleManager } from '../components/dashboard/ScheduleManager';
import { DriverMessagesList } from './DriverMessagesList';
import { Settings } from '../components/dashboard/Settings';
import { ReferralCode } from '../components/ReferralCode';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Driver } from '../types/driver';
import { authService } from '../lib/services/auth.service';
import { OnlineToggle } from '../components/dashboard/OnlineToggle';
import { useNavigate, Link } from 'react-router-dom';

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
    await authService.signOut();
    navigate('/driver/login');
  };

  if (!driver) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  const tabNames = ['Overview', 'Rides', 'Schedule', 'Messages', 'Settings'];
  const tabs: TabItem[] = [
    { name: tabNames[0], component: () => <Overview driver={driver} onUpdate={handleDriverUpdate} /> },
    { name: tabNames[1], component: () => <RidesManagement driverId={driver.id} /> },
    { name: tabNames[2], component: () => <ScheduleManager driverId={driver.id} /> },
    { name: tabNames[3], component: () => <DriverMessagesList /> },
    { name: tabNames[4], component: () => <Settings driver={driver} onUpdate={handleDriverUpdate} /> }
  ];

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="https://aiautomationsstorage.blob.core.windows.net/cbl/citybucketlist%20logo.png" 
              alt="City Bucket List" 
              className="h-12 object-contain"
            />
          </Link>
          <div className="flex items-center space-x-4">
            <OnlineToggle 
              driverId={driver.id} 
              isOnline={driver.isOnline || false} 
            />
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        <DriverFooterNav
          tabs={tabNames}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6">
          <ActiveComponent />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Earnings and Stats */}
          <div className="space-y-6">
            <div className="bg-neutral-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Today's Stats</h2>
              {/* Add stats content */}
            </div>
          </div>

          {/* Referral Section */}
          <div>
            <ReferralCode />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverPortal;