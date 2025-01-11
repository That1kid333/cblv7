import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';
import { auth } from '../lib/firebase';
import { authService } from '../lib/services/auth.service';
import { subscribeToNewMessages } from '../lib/services/messages.service';

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const currentUser = auth.currentUser;

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToNewMessages((newMessage) => {
      setNotificationCount((prevCount) => prevCount + 1);
    });

    return () => unsubscribe();
  }, []);

  const handleBellClick = () => {
    setNotificationCount(0); // Reset count when notifications are viewed
    navigate('/messages'); // Navigate to messages page
  };

  return (
    <header className="bg-black py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="https://aiautomationsstorage.blob.core.windows.net/cbl/citybucketlist%20logo.png"
              alt="CityBucketList.com"
              className="h-8 object-contain"
            />
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white hover:text-[#C69249]"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/rider/portal" 
              className="px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors"
            >
              Go to Rider Portal
            </Link>
            <Link 
              to="/driver/portal" 
              className="px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors"
            >
              Go to Driver Portal
            </Link>
            
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/driver/login"
                className="px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors"
              >
                Driver Login
              </Link>
            )}
          </nav>
          <div onClick={handleBellClick} style={{ cursor: 'pointer' }}>
            <Bell />
            {notificationCount > 0 && <span>{notificationCount}</span>}
          </div>
        </div>

        <nav
          className={`lg:hidden ${
            isMenuOpen ? 'flex' : 'hidden'
          } flex-col space-y-4 mt-4 border-t border-neutral-800 pt-4`}
        >
          <Link
            to="/rider/portal"
            className="w-full px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Go to Rider Portal
          </Link>
          <Link
            to="/driver/portal"
            className="w-full px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Go to Driver Portal
          </Link>
          
          {currentUser ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/driver/login"
              className="w-full px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Driver Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}