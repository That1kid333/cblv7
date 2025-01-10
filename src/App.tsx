import { Routes, Route } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import RiderPortal from './pages/RiderPortal';
import DriverPortal from './pages/DriverPortal';
import DriverSignup from './pages/DriverSignup';
import DriverLogin from './pages/DriverLogin';
import RiderSignup from './pages/RiderSignup';
import RiderLogin from './pages/RiderLogin';
import RideConfirmation from './pages/RideConfirmation';
import ReferralSignup from './pages/ReferralSignup';
import ThankYouPage from './pages/ThankYouPage';
import Messages from './pages/Messages';
import MessagesList from './pages/MessagesList';
import DriverMessagesList from './pages/DriverMessagesList';
import ProtectedRoute from './components/ProtectedRoute';
import RiderProtectedRoute from './components/RiderProtectedRoute';
import GuestRideConfirmation from './pages/GuestRideConfirmation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/guest/confirmation" element={<GuestRideConfirmation />} />
      <Route path="/driver/signup" element={<DriverSignup />} />
      <Route path="/driver/login" element={<DriverLogin />} />
      <Route path="/rider/signup" element={<RiderSignup />} />
      <Route path="/rider/login" element={<RiderLogin />} />
      <Route path="/referral" element={<ReferralSignup />} />
      <Route path="/ride/confirmation/:rideId" element={<RideConfirmation />} />
      <Route
        path="/messages"
        element={
          <RiderProtectedRoute>
            <MessagesList />
          </RiderProtectedRoute>
        }
      />
      <Route
        path="/messages/:contactId"
        element={
          <RiderProtectedRoute>
            <Messages />
          </RiderProtectedRoute>
        }
      />
      <Route
        path="/driver/messages"
        element={
          <ProtectedRoute>
            <DriverMessagesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/messages/:contactId"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider/*"
        element={
          <RiderProtectedRoute>
            <RiderPortal />
          </RiderProtectedRoute>
        }
      />
      <Route
        path="/driver/*"
        element={
          <ProtectedRoute>
            <DriverPortal />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;