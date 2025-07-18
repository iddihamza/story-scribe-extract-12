import React from 'react';

interface ProcessIndicatorProps {
  currentStep: number;
}

export const ProcessIndicator: React.FC<ProcessIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, icon: '📝', label: 'Input Content' },
    { id: 2, icon: '🔍', label: 'Extract & Parse' },
    { id: 3, icon: '📋', label: 'Review & Approve' },
  ];

  return (
    <div className="flex justify-center gap-5 mb-8">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`flex items-center gap-3 px-5 py-3 rounded-full text-white text-sm transition-all duration-300 ${
            currentStep === step.id 
              ? 'bg-white/30 backdrop-blur-sm' 
              : 'bg-white/10 backdrop-blur-sm'
          }`}
        >
          <span className="text-base">{step.icon}</span>
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
};