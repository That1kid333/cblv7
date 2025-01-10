import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, Phone, FileText, 
  MessageSquare, AlertCircle, CheckCircle, HelpCircle 
} from 'lucide-react';

interface Incident {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved';
  date: string;
}

export function SafetyCenter() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [incidents] = useState<Incident[]>([
    {
      id: '1',
      type: 'Vehicle Issue',
      description: 'Check engine light came on during ride',
      status: 'resolved',
      date: '2024-03-15'
    },
    {
      id: '2',
      type: 'Customer Concern',
      description: 'Passenger was acting aggressively',
      status: 'reviewing',
      date: '2024-03-14'
    }
  ]);

  const handleEmergency = () => {
    // In a real app, this would trigger emergency protocols
    window.location.href = 'tel:911';
  };

  return (
    <div className="space-y-6">
      {/* Emergency Assistance */}
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <h2 className="text-xl font-semibold text-red-500">Emergency Assistance</h2>
              <p className="text-neutral-400">
                Immediate help is available 24/7
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Get Help Now
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-neutral-900 p-6 rounded-lg text-left hover:bg-neutral-800 transition-colors"
        >
          <FileText className="w-6 h-6 text-[#F5A623] mb-2" />
          <h3 className="font-semibold mb-1">Report Incident</h3>
          <p className="text-sm text-neutral-400">
            File a detailed incident report
          </p>
        </button>

        <button className="bg-neutral-900 p-6 rounded-lg text-left hover:bg-neutral-800 transition-colors">
          <MessageSquare className="w-6 h-6 text-[#F5A623] mb-2" />
          <h3 className="font-semibold mb-1">Safety Team Chat</h3>
          <p className="text-sm text-neutral-400">
            Chat with our safety team
          </p>
        </button>

        <button className="bg-neutral-900 p-6 rounded-lg text-left hover:bg-neutral-800 transition-colors">
          <Shield className="w-6 h-6 text-[#F5A623] mb-2" />
          <h3 className="font-semibold mb-1">Safety Tips</h3>
          <p className="text-sm text-neutral-400">
            View safety guidelines
          </p>
        </button>
      </div>

      {/* Recent Incidents */}
      <div className="bg-neutral-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-neutral-800 p-4 rounded-lg flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{incident.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    incident.status === 'resolved'
                      ? 'bg-green-500/20 text-green-500'
                      : incident.status === 'reviewing'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-neutral-500/20 text-neutral-500'
                  }`}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-neutral-400">{incident.description}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(incident.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Emergency Assistance</h3>
              <p className="text-neutral-400">
                Choose the type of emergency assistance you need
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleEmergency}
                className="w-full flex items-center gap-3 p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Call 911</span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors">
                <Shield className="w-5 h-5" />
                <span>Contact Safety Team</span>
              </button>

              <button
                onClick={() => setShowEmergencyModal(false)}
                className="w-full p-4 text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Incident Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Report an Incident</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Incident Type
                </label>
                <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2">
                  <option>Vehicle Issue</option>
                  <option>Customer Concern</option>
                  <option>Safety Violation</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 h-32 resize-none"
                  placeholder="Describe what happened..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}