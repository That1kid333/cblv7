import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Header } from '../components/Header';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-[#C69249]" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#C69249] mb-4">
            Thank You for Your Request!
          </h1>
          
          <p className="text-lg text-neutral-300 mb-8">
            Your ride request has been received. One of our professional drivers will
            contact you shortly to confirm your booking details.
          </p>

          <div className="bg-neutral-900 rounded-lg p-6 mb-8">
            <h2 className="font-semibold mb-4">What happens next?</h2>
            <ul className="text-left text-neutral-300 space-y-3">
              <li>• A driver will review your request</li>
              <li>• You'll receive a confirmation call/message</li>
              <li>• Final pricing will be confirmed</li>
              <li>• Your ride details will be scheduled</li>
            </ul>
          </div>

          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors"
          >
            Return Home
          </Link>
        </div>
      </main>
    </div>
  );
}