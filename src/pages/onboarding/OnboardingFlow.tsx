import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';
import { DocumentUpload } from '../../components/onboarding/DocumentUpload';
import { SubscriptionPlan } from '../../components/onboarding/SubscriptionPlan';
import { PersonalInfoForm } from '../../components/onboarding/PersonalInfoForm';
import { VehicleInfoForm } from '../../components/onboarding/VehicleInfoForm';
import { storage } from '../../lib/firebase';
import { uploadFile, getStoragePath } from '../../lib/utils/storage';
import { Driver, initialDriver } from '../../types/driver';

const STEPS = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic details and contact information'
  },
  {
    id: 'documents',
    title: 'Document Verification',
    description: 'Upload required documents and licenses'
  },
  {
    id: 'vehicle',
    title: 'Vehicle Information',
    description: 'Your vehicle details and documentation'
  },
  {
    id: 'subscription',
    title: 'Elite Membership',
    description: 'Join our premium drivers program'
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Final review of your application'
  }
];

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [driver, setDriver] = useState<Driver>(initialDriver);

  const steps = STEPS.map((step, index) => ({
    ...step,
    completed: index < currentStep,
    current: index === currentStep
  }));

  const handleDriverUpdate = (updates: Partial<Driver>) => {
    setDriver(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString()
    }));
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const path = getStoragePath('profile', driver.id, `profile_${Date.now()}.${file.name.split('.').pop()}`);
      const url = await uploadFile(file, path);
      handleDriverUpdate({ photo: url });
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleDocumentUpload = async (file: File, type: string) => {
    try {
      const path = getStoragePath(
        'document',
        driver.id,
        `${type}_${Date.now()}.${file.name.split('.').pop()}`
      );
      const url = await uploadFile(file, path);

      if (type === 'driversLicense') {
        handleDriverUpdate({
          driversLicense: {
            ...driver.driversLicense,
            documentUrl: url
          }
        });
      } else if (type === 'backgroundCheck') {
        handleDriverUpdate({
          backgroundCheck: {
            ...driver.backgroundCheck,
            documentUrl: url
          }
        });
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      handleDriverUpdate({
        subscription: {
          status: 'active',
          plan: 'elite',
          startDate: new Date().toISOString(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Final submission will be handled by auth service during registration
      navigate('/driver/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#F5A623] mb-8">
            Driver Application
          </h1>

          <OnboardingProgress steps={steps} />

          <div className="mt-8">
            {currentStep === 0 && (
              <PersonalInfoForm
                driver={driver}
                onChange={handleDriverUpdate}
                onPhotoUpload={handlePhotoUpload}
              />
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <DocumentUpload
                  label="Driver's License"
                  accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                  onUpload={(file) => handleDocumentUpload(file, 'driversLicense')}
                  isUploaded={!!driver.driversLicense.documentUrl}
                />
                
                <DocumentUpload
                  label="Background Check Consent"
                  accept={{ 'application/pdf': ['.pdf'] }}
                  onUpload={(file) => handleDocumentUpload(file, 'backgroundCheck')}
                  isUploaded={!!driver.backgroundCheck.documentUrl}
                />
              </div>
            )}

            {currentStep === 2 && (
              <VehicleInfoForm
                driver={driver}
                onChange={handleDriverUpdate}
              />
            )}

            {currentStep === 3 && (
              <SubscriptionPlan
                onSubscribe={handleSubscribe}
                isLoading={isLoading}
              />
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-neutral-900 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Application Review</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-[#F5A623]">Personal Information</h3>
                      <p>Name: {driver.name}</p>
                      <p>Email: {driver.email}</p>
                      <p>Phone: {driver.phone}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-[#F5A623]">Vehicle Information</h3>
                      <p>{driver.vehicle.year} {driver.vehicle.make} {driver.vehicle.model}</p>
                      <p>License Plate: {driver.vehicle.plate}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-[#F5A623]">Documents</h3>
                      <p>Driver's License: {driver.driversLicense.documentUrl ? '✓ Uploaded' : '✗ Missing'}</p>
                      <p>Background Check: {driver.backgroundCheck.documentUrl ? '✓ Uploaded' : '✗ Missing'}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full mt-6 py-3 bg-[#F5A623] text-white rounded-lg font-semibold hover:bg-[#E09612] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </div>
            )}

            {currentStep < 4 && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 0}
                  className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-6 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}