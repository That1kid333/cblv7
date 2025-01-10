import { useState, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { authService } from '../../lib/services/auth.service';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  notes: string;
}

interface ScheduleManagerProps {
  driverId?: string;
}

export function ScheduleManager({ driverId }: ScheduleManagerProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState<Omit<TimeSlot, 'id'>>({
    day: 'Monday',
    startTime: '',
    endTime: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupScheduleListener = async () => {
      const user = await authService.getCurrentUser();
      if (!user && !driverId) return;

      const driverRef = doc(db, 'drivers', driverId || user!.uid);
      unsubscribe = onSnapshot(driverRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setAvailableSlots(data.schedule || []);
        }
        setLoading(false);
      });
    };

    setupScheduleListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [driverId]);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(new Date()), i);
    return format(date, 'EEEE');
  });

  const handleAddSlot = async () => {
    const user = await authService.getCurrentUser();
    if (!user && !driverId) return;

    const id = Date.now().toString();
    const newTimeSlot = { ...newSlot, id };

    try {
      const driverRef = doc(db, 'drivers', driverId || user!.uid);
      await updateDoc(driverRef, {
        schedule: arrayUnion(newTimeSlot)
      });
      setShowAddSlot(false);
      setNewSlot({
        day: 'Monday',
        startTime: '',
        endTime: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding time slot:', error);
    }
  };

  const handleRemoveSlot = async (slot: TimeSlot) => {
    const user = await authService.getCurrentUser();
    if (!user && !driverId) return;

    try {
      const driverRef = doc(db, 'drivers', driverId || user!.uid);
      await updateDoc(driverRef, {
        schedule: arrayRemove(slot)
      });
    } catch (error) {
      console.error('Error removing time slot:', error);
    }
  };

  const handleUpdateNotes = async (slot: TimeSlot, newNotes: string) => {
    const user = await authService.getCurrentUser();
    if (!user && !driverId) return;

    try {
      const driverRef = doc(db, 'drivers', driverId || user!.uid);
      const updatedSlot = { ...slot, notes: newNotes };
      
      // Remove old slot and add updated one
      await updateDoc(driverRef, {
        schedule: arrayRemove(slot)
      });
      await updateDoc(driverRef, {
        schedule: arrayUnion(updatedSlot)
      });
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekly Calendar View */}
      <div className="bg-neutral-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Weekly Schedule</h2>
          <button
            onClick={() => setShowAddSlot(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58239]"
          >
            <Plus className="w-4 h-4" /> Add Time Slot
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {weekDays.map(day => (
            <div key={day} className="bg-neutral-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-white">{day}</h3>
              {availableSlots.filter(slot => slot.day === day).map(slot => (
                <div key={slot.id} className="mb-2">
                  <div className="flex items-center justify-between text-[#C69249] p-2 bg-neutral-700 rounded-t">
                    <span>{slot.startTime} - {slot.endTime}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setExpandedSlot(expandedSlot === slot.id ? null : slot.id)}
                        className="hover:text-white transition-colors"
                      >
                        {expandedSlot === slot.id ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </button>
                      <button 
                        onClick={() => handleRemoveSlot(slot)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {expandedSlot === slot.id && (
                    <div className="p-2 bg-neutral-600 rounded-b">
                      <textarea
                        placeholder="Add notes about this scheduled time..."
                        value={slot.notes || ''}
                        onChange={(e) => handleUpdateNotes(slot, e.target.value)}
                        className="w-full p-2 rounded bg-neutral-700 text-white text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#C69249]"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Add Time Slot Modal */}
      {showAddSlot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-white">Add New Time Slot</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-1">Day</label>
                <select
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                  className="w-full p-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:border-[#C69249] focus:ring-1 focus:ring-[#C69249]"
                >
                  {weekDays.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white mb-1">Start Time</label>
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="w-full p-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:border-[#C69249] focus:ring-1 focus:ring-[#C69249]"
                />
              </div>
              <div>
                <label className="block text-white mb-1">End Time</label>
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="w-full p-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:border-[#C69249] focus:ring-1 focus:ring-[#C69249]"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Notes (Optional)</label>
                <textarea
                  placeholder="Add any notes about this time slot..."
                  value={newSlot.notes}
                  onChange={(e) => setNewSlot({ ...newSlot, notes: e.target.value })}
                  className="w-full p-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:border-[#C69249] focus:ring-1 focus:ring-[#C69249] resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAddSlot(false)}
                  className="px-4 py-2 text-white bg-neutral-800 rounded-lg hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSlot}
                  className="px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58239]"
                >
                  Add Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}