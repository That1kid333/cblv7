import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { RideHistory } from '../components/RideHistory';
import { MessagesTab } from '../components/MessagesTab';
import { RiderSettings } from '../components/RiderSettings';
import { FooterNav } from '../components/FooterNav';
import { RideBooking } from '../components/RideBooking';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

interface TabItem {
  name: string;
  component: React.ComponentType<any>;
}

function RiderPortal() {
  const [activeTab, setActiveTab] = useState(0);
  const { rider } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  
  useEffect(() => {
    // If coming from ride confirmation, switch to messages tab
    if (location.state?.from === 'confirmation') {
      setActiveTab(2); // Index of Messages tab
    }
  }, [location.state]);

  useEffect(() => {
    // Set active tab based on URL parameter
    if (tabParam === 'messages') {
      setActiveTab(2); // Index of Messages tab
    }
  }, [tabParam]);
  
  const tabs: TabItem[] = [
    { name: 'Ride History', component: RideHistory },
    { 
      name: 'Book a Ride', 
      component: () => <RideBooking cityId={rider?.serviceLocations?.[0] || ''} /> 
    },
    { name: 'Messages', component: MessagesTab },
    { name: 'Settings', component: RiderSettings }
  ];

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="h-[calc(100vh-64px)] overflow-y-auto">
        <div className="container mx-auto px-4 py-4 md:py-8 pb-24 md:pb-8">
          {/* Title - Hidden on mobile when not on first tab */}
          <div className={`mb-4 md:mb-8 ${activeTab !== 0 ? 'hidden md:block' : ''}`}>
            <h1 className="text-2xl md:text-3xl font-bold">Rider Portal</h1>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex space-x-4 mb-8">
            {tabs.map((tab, index) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === index
                    ? 'bg-[#C69249] text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#C69249] focus:ring-offset-2 focus:ring-offset-black`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-neutral-900 rounded-lg p-4 md:p-6 min-h-[calc(100vh-200px)] md:min-h-0">
            <ActiveComponent />
          </div>
        </div>

        {/* Mobile Footer Navigation */}
        <FooterNav activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </div>
  );
}

export default RiderPortal;
