import React from 'react';
import { Check, Circle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface OnboardingProgressProps {
  steps: Step[];
}

export function OnboardingProgress({ steps }: OnboardingProgressProps) {
  return (
    <div className="py-6">
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {index !== steps.length - 1 && (
              <div
                className={`absolute left-4 top-10 h-full w-0.5 -ml-px
                  ${step.completed ? 'bg-[#F5A623]' : 'bg-neutral-700'}`
                }
              />
            )}
            
            <div className="relative flex items-start">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full
                  ${step.completed 
                    ? 'bg-[#F5A623]' 
                    : step.current
                      ? 'bg-[#F5A623]/20 border-2 border-[#F5A623]'
                      : 'bg-neutral-800'
                  }`}
              >
                {step.completed ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Circle className={`w-5 h-5 ${
                    step.current ? 'text-[#F5A623]' : 'text-neutral-400'
                  }`} />
                )}
              </span>
              
              <div className="ml-4">
                <h3 className={`text-lg font-semibold ${
                  step.current ? 'text-[#F5A623]' : 'text-white'
                }`}>
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}