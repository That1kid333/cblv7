import React from 'react';
import { CreditCard, Plus } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
}

export function PaymentSettings() {
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      expiryDate: '12/24',
      isDefault: true
    },
    {
      id: '2',
      type: 'bank',
      last4: '1234',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = React.useState(false);

  const setDefaultMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const removeMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>

      <div className="space-y-4">
        {paymentMethods.map(method => (
          <div
            key={method.id}
            className="bg-neutral-800 p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CreditCard className={`w-5 h-5 ${method.isDefault ? 'text-[#F5A623]' : 'text-neutral-500'}`} />
              <div>
                <div className="font-medium">
                  {method.type === 'card' ? 'Card' : 'Bank Account'} •••• {method.last4}
                </div>
                {method.expiryDate && (
                  <div className="text-sm text-neutral-400">
                    Expires {method.expiryDate}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!method.isDefault && (
                <>
                  <button
                    onClick={() => setDefaultMethod(method.id)}
                    className="text-sm px-3 py-1 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
                  >
                    Set Default
                  </button>
                  <button
                    onClick={() => removeMethod(method.id)}
                    className="text-sm px-3 py-1 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Remove
                  </button>
                </>
              )}
              {method.isDefault && (
                <span className="text-sm px-3 py-1 bg-[#F5A623]/10 text-[#F5A623] rounded-lg">
                  Default
                </span>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Payment Method
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Payment Method</h3>
            {/* Stripe Elements would be integrated here */}
            <div className="space-y-4">
              <div className="h-40 bg-neutral-800 rounded-lg flex items-center justify-center">
                <span className="text-neutral-400">Stripe Elements Placeholder</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors"
                >
                  Add Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}